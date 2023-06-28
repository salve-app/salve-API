import { MessageInputData } from '@/controllers/saves-controller'
import chatRepository from '@/repositories/chats-repository'
import savesRepository from '@/repositories/saves-repository'
import {
	formatSaveContent,
	getSeparetedSavesAccordinglyUserFunction,
} from '@/utils/helpers/saves'

import { getUserProfileOrThrow } from '../users-service'

async function getAllSaveCategories() {
	const categories = await savesRepository.findAllCategories()

	return categories.map((category) => ({
		...category,
		name: SaveCategories[category.name],
	}))
}

async function createSave(save: SaveForm, userId: number) {
	const { id } = await getUserProfileOrThrow(userId)

	await savesRepository.create(save, id)
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

	const nearbySaves = await savesRepository.findNearbySavesByCoordinates(
		coordinates.latitude,
		coordinates.longitude,
		range,
		id
	)

	return formatSaveContent(nearbySaves)
}

async function createChatMessage(
	saveId: number,
	userId: number,
	messageData: MessageInputData
) {
	const { chatId, message } = messageData

	const { id: profileId } = await getUserProfileOrThrow(userId)

	const { requesterId } = await getSaveOrThrow(saveId)

	const chat = await chatRepository.findChatById(chatId)

	if (!chat) throw new Error('Not found - chat não encontrado')

	if (chat.requesterId !== requesterId)
		throw new Error('Forbidden - chat não encontrado')

	await chatRepository.createMessage(chatId, message, profileId)
}

async function getChatMessages(saveId: number, userId: number) {
	const { id: providerId } = await getUserProfileOrThrow(userId)

	const { requesterId } = await getSaveOrThrow(saveId)

	const chat = await chatRepository.findChatMessagesBySaveIdAndProvider(
		saveId,
		providerId
	)

	if (!chat) return chatRepository.createChat(saveId, requesterId, providerId)

	return chat
}

async function getSaveChatList(saveId: number, userId: number) {
	await getUserProfileOrThrow(userId)

	await getSaveOrThrow(saveId)

	const chat = await chatRepository.findChatsBySaveId(saveId)

	const chatWithLastMessage = chat.map(({ id, provider, messages }) => ({
		id,
		provider,
		lastMessage: messages[0].message,
	}))

	return chatWithLastMessage
}

async function updateSaveStatusToInProgress(saveId: number, userId: number) {
	const { id: providerId } = await getUserProfileOrThrow(userId)

	const { status } = await getSaveOrThrow(saveId)

	if (status !== 'CREATED') throw new Error('Bad request')

	const chat = await chatRepository.findChatMessagesBySaveIdAndProvider(
		saveId,
		providerId
	)

	if (!chat) throw new Error('Not found')

	if (!chat.acceptedSave) throw new Error('Bad request')

	await savesRepository.updateSaveStatusToInProgress(saveId, providerId)
}

async function updateSaveStatusToComplete(
	saveId: number,
	rating: number,
	userId: number
) {
	const { id: requesterId } = await getUserProfileOrThrow(userId)

	const { status, requesterId: saveRequesterId } = await getSaveOrThrow(saveId)

	if (status !== 'IN_PROGRESS') throw new Error('Bad request')

	if (requesterId !== saveRequesterId) throw new Error('Forbidden')

	await savesRepository.updateSaveStatusToComplete(saveId, +rating)
}

export async function getSaveOrThrow(saveId: number) {
	const save = await savesRepository.findById(saveId)

	if (!save) throw new Error('Não tem salve')

	return save
}

enum SaveCategories {
  SOFT = 'Suave',
  MEDIUM = 'Da pra aguentar',
  HARD = 'Urgente',
}
export interface SaveForm {
  description: string;
  categoryId: number;
  cost: number;
  address: AddressForm;
}
export interface AddressForm {
  cep: string;
  neighborhood: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

export default {
	createSave,
	createChatMessage,
	getAllSaveCategories,
	getNearbySaves,
	getChatMessages,
	getSaveChatList,
	getMyActiveSaves,
	updateSaveStatusToInProgress,
	updateSaveStatusToComplete,
}
