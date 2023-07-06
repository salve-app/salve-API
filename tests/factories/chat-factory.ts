import { prisma } from '@/config/database'
import { faker } from '@faker-js/faker'

export async function createChatWithMessage(
	saveId: number,
	requesterId: number,
	providerId: number
) {
	return prisma.chat.create({
		data: {
			saveId,
			requesterId,
			providerId,
			messages: {
				create: {
					message: faker.lorem.text(),
					ownerId: providerId,
				},
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

export async function createChatWithMessageAndAcceptedSave(
	saveId: number,
	requesterId: number,
	providerId: number
) {
	return prisma.chat.create({
		data: {
			saveId,
			requesterId,
			providerId,
			acceptedSave: true,
			messages: {
				create: {
					message: faker.lorem.text(),
					ownerId: providerId,
				},
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
