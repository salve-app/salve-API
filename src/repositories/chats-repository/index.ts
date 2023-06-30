import { prisma } from '@/config/database'

async function findChatMessagesBySaveIdAndProvider(
	saveId: number,
	profileId: number
) {
	return prisma.chat.findUnique({
		where: {
			saveId_providerId: {
				saveId,
				providerId: profileId,
			},
		},
		select: {
			id: true,
			acceptedSave: true,
			messages: {
				select: {
					id: true,
					message: true,
					createdAt: true,
					ownerId: true,
				},
			},
		},
	})
}

async function createChat(
	saveId: number,
	requesterId: number,
	providerId: number
) {
	return prisma.chat.create({
		data: {
			requesterId,
			providerId,
			saveId,
		},
		select: {
			id: true,
			messages: true,
		},
	})
}

async function createMessage(chatId: number, message: string, ownerId: number) {
	return prisma.message.create({
		data: {
			chatId,
			ownerId,
			message,
		},
	})
}

async function findChatsBySaveId(saveId: number) {
	return prisma.chat.findMany({
		where: {
			saveId,
			messages: {
				some: {},
			},
		},
		select: {
			id: true,
			provider: {
				select: {
					id: true,
					fullName: true,
				},
			},
			messages: {
				select: {
					message: true,
				},
				orderBy: {
					id: 'desc',
				},
				take: 1,
			},
		},
		orderBy: {
			id: 'desc',
		},
	})
}

async function findChatById(id: number) {
	return prisma.chat.findUnique({
		where: {
			id,
		},
		select: {
			id: true,
			acceptedSave: true,
			requesterId: true,
			providerId: true,
			provider: {
				select: {
					id: true,
					fullName: true,
				},
			},
			messages: {
				select: {
					id: true,
					ownerId: true,
					message: true,
					createdAt: true,
				},
			},
		},
	})
}

async function updateAcceptedSaveByChatId(id: number) {
	return prisma.chat.update({
		where: {
			id,
		},
		data: {
			acceptedSave: true,
		},
	})
}

export default {
	findChatMessagesBySaveIdAndProvider,
	createChat,
	createMessage,
	findChatsBySaveId,
	findChatById,
	updateAcceptedSaveByChatId,
}
