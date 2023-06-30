import chatRepository from '@/repositories/chats-repository'

import { getUserProfileOrThrow } from '../users-service'
import { forbidden, notFound } from '@/errors'

async function getMessagesByChatId(chatId: number, userId: number) {
	const { id: profileId } = await getUserProfileOrThrow(userId)

	const { requesterId, providerId, provider, messages, acceptedSave } =
		await getChatOrThrow(chatId)

	throwIfProfileIdIsNotValid(requesterId, providerId, profileId)

	return { acceptedSave, provider, messages }
}

async function updateProviderAccept(chatId: number, userId: number) {
	const { id: profileId } = await getUserProfileOrThrow(userId)

	const { requesterId } = await getChatOrThrow(chatId)

	throwIfRequesterIdIsNotValid(profileId, requesterId)

	await chatRepository.updateAcceptedSaveByChatId(chatId)
}

async function getChatOrThrow(chatId: number) {
	const chat = chatRepository.findChatById(chatId)

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

export default {
	getMessagesByChatId,
	updateProviderAccept,
}
