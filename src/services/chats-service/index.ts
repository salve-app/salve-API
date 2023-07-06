import chatRepository from '@/repositories/chats-repository'
import { getUserProfileOrThrow } from '../users-service'
import { forbidden, notFound } from '@/errors'
import { MessageInputData } from '@/utils/interfaces/chats'
import { getSaveOrThrow } from '../saves-service'

async function getMessagesByChatId(chatId: number, userId: number) {
	const { id: profileId } = await getUserProfileOrThrow(userId)

	const { requesterId, providerId, provider, messages, acceptedSave } =
		await getChatOrThrow(chatId)

	throwIfProfileIdIsNotValid(requesterId, providerId, profileId)

	return { acceptedSave, provider, messages }
}

async function createChatMessage(
	chatId: number,
	userId: number,
	messageData: MessageInputData
) {
	const { message, saveId } = messageData

	const { id: profileId } = await getUserProfileOrThrow(userId)

	const { requesterId } = await getSaveOrThrow(saveId)

	const { id } = await getChatOrCreateIfNotExist(
		chatId,
		saveId,
		requesterId,
		profileId
	)

	await chatRepository.createMessage(id, message, profileId)
}

async function updateProviderAccept(chatId: number, userId: number) {
	const { id: profileId } = await getUserProfileOrThrow(userId)

	const { requesterId } = await getChatOrThrow(chatId)

	throwIfRequesterIdIsNotValid(profileId, requesterId)

	await chatRepository.updateAcceptedSaveByChatId(chatId)
}

export default {
	getMessagesByChatId,
	updateProviderAccept,
	createChatMessage,
}

async function getChatOrThrow(chatId: number) {
	const chat = await chatRepository.findChatById(chatId)

	if (!chat) throw notFound('Chat não existe!')

	return chat
}

function throwIfProfileIdIsNotValid(
	requesterId: number,
	providerId: number,
	profileId: number
) {
	if (requesterId !== profileId && providerId !== profileId)
		throw forbidden('O usuário não tem permissão para fazer isso!')
}

function throwIfRequesterIdIsNotValid(profileId: number, requesterId: number) {
	if (requesterId !== profileId)
		throw forbidden('O usuário não tem permissão para fazer isso!')
}

async function getChatOrCreateIfNotExist(
	chatId: number,
	saveId: number,
	requesterId: number,
	ownerMessageId: number
) {
	const chat = await chatRepository.findChatById(chatId)

	if (!chat && ownerMessageId !== requesterId)
		return chatRepository.createChat(saveId, requesterId, ownerMessageId)

	return chat
}
