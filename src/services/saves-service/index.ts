import chatRepository from '@/repositories/chats-repository'
import savesRepository from '@/repositories/saves-repository'
import {
	formatSaveContent,
	getSeparetedSavesAccordinglyUserFunction,
} from '@/utils/helpers/saves'
import { getUserProfileOrThrow } from '../users-service'
import { getAddressByCepOrThrow } from '@/utils/helpers/addresses'
import { badRequest, forbidden, notFound } from '@/errors'
import { getChatListWithLastMessage } from '@/utils/helpers/chats'

async function getAllSaveCategories() {
	const categories = await savesRepository.findAllCategories()

	return categories.map((category) => ({
		...category,
		name: SaveCategories[category.name],
	}))
}

async function createSave(save: SaveForm, userId: number) {
	const { id: profileId, coins } = await getUserProfileOrThrow(userId)

	await getAddressByCepOrThrow(save.address.cep)

	throwIfProfileCoinsIsLessThanSaveCost(save.cost, coins.toNumber())

	await savesRepository.create(save, profileId)
}

async function getMyActiveSaves(userId: number) {
	const { id: profileId } = await getUserProfileOrThrow(userId)

	const myActiveSaves = await savesRepository.findSavesByProfileId(profileId)

	const formatedSave = formatSaveContent(myActiveSaves)

	const savesAccordinglyUserFunction = getSeparetedSavesAccordinglyUserFunction(
		formatedSave,
		profileId
	)

	return savesAccordinglyUserFunction
}

async function getNearbySaves(
	coordinates: { latitude: number; longitude: number },
	range: number,
	userId: number
) {
	const { id } = await getUserProfileOrThrow(userId)

	throwIfNotANumber(coordinates.latitude, coordinates.longitude, range)

	const nearbySaves = await savesRepository.findNearbySavesByCoordinates(
		coordinates.latitude,
		coordinates.longitude,
		range,
		id
	)

	return formatSaveContent(nearbySaves)
}

async function getChatMessages(saveId: number, userId: number) {
	const { id: providerId } = await getUserProfileOrThrow(userId)

	await getSaveOrThrow(saveId)

	const chat = await chatRepository.findChatMessagesBySaveIdAndProvider(
		saveId,
		providerId
	)

	return chat
}

async function getSaveChatList(saveId: number, userId: number) {
	await getUserProfileOrThrow(userId)

	await getSaveOrThrow(saveId)

	const chat = await chatRepository.findChatsBySaveId(saveId)

	const chatListWithLastMessage = getChatListWithLastMessage(chat)

	return chatListWithLastMessage
}

async function updateSaveStatusToInProgress(saveId: number, userId: number) {
	const { id: providerId } = await getUserProfileOrThrow(userId)

	const { status } = await getSaveOrThrow(saveId)

	throwIfStatusIsNotCreated(status)

	await throwIfChatNotExist(saveId, providerId)

	await savesRepository.updateSaveStatusToInProgress(saveId, providerId)
}

async function updateSaveStatusToComplete(
	saveId: number,
	rating: number,
	userId: number
) {
	const { id: requesterId } = await getUserProfileOrThrow(userId)

	const { status, requesterId: saveRequesterId } = await getSaveOrThrow(saveId)

	throwIfSaveIsNotInProgress(status)

	throwIfRequesterIdIsNotValid(requesterId, saveRequesterId)

	await savesRepository.updateSaveStatusToComplete(saveId, +rating)
}

export default {
	createSave,
	getAllSaveCategories,
	getNearbySaves,
	getChatMessages,
	getSaveChatList,
	getMyActiveSaves,
	updateSaveStatusToInProgress,
	updateSaveStatusToComplete,
}

function throwIfNotANumber(...elements: Array<number>) {
	if (elements.some((e) => !e)) throw badRequest('Dados inválidos!')
}

function throwIfProfileCoinsIsLessThanSaveCost(cost: number, coins: number) {
	if (cost > coins) throw badRequest('O usuário não possui coins o suficiente')
}

function throwIfStatusIsNotCreated(status: string) {
	if (status !== 'CREATED') throw badRequest('Status não pode ser alterado')
}

export async function getSaveOrThrow(saveId: number) {
	const save = await savesRepository.findById(saveId)

	if (!save) throw notFound('Salve não encontrado!')

	return save
}

async function throwIfChatNotExist(saveId: number, providerId: number) {
	const chat = await chatRepository.findChatMessagesBySaveIdAndProvider(
		saveId,
		providerId
	)

	if (!chat) throw notFound('Chat não existe!')

	if (!chat.acceptedSave) throw badRequest('O salvador ainda não foi aceito!')
}

function throwIfSaveIsNotInProgress(status: string) {
	if (status !== 'IN_PROGRESS')
		throw badRequest('O salve não está em progresso!')
}

function throwIfRequesterIdIsNotValid(
	requesterId: number,
	saveRequesterId: number
) {
	if (requesterId !== saveRequesterId)
		throw forbidden('Você não tem permissão para isso!')
}

enum SaveCategories {
	SOFT = 'Suave',
	MEDIUM = 'Da pra aguentar',
	HARD = 'Urgente',
}
export interface SaveForm {
	description: string
	categoryId: number
	cost: number
	address: AddressForm
}
export interface AddressForm {
	cep: string
	neighborhood: string
	street: string
	number: string
	complement?: string
	city: string
	state: string
	latitude: number
	longitude: number
}
