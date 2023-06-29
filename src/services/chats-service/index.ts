import chatRepository from '@/repositories/chats-repository'

import { getUserProfileOrThrow } from '../users-service'

async function getMessagesByChatId(chatId: number, userId: number) {
	const { id: profileId } = await getUserProfileOrThrow(userId)

	const { requesterId, providerId, provider, messages, acceptedSave } =
		await getChatOrThrow(chatId)

	if (requesterId !== profileId && providerId !== profileId)
		throw new Error('Forbidden')

	return { acceptedSave, provider, messages }
}

async function updateProviderAccept(chatId: number, userId: number) {
	const { id: profileId } = await getUserProfileOrThrow(userId)

	const { requesterId } = await getChatOrThrow(chatId)

	if (requesterId !== profileId) throw new Error('Forbidden')

	await chatRepository.updateAcceptedSaveByChatId(chatId)
}

async function getChatOrThrow(chatId: number) {
	const chat = chatRepository.findChatById(chatId)

	if (!chat) throw new Error('NotFound')

	return chat
}

export default {
	getMessagesByChatId,
	updateProviderAccept,
}
