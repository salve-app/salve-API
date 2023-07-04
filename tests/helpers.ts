import * as jwt from 'jsonwebtoken'
import { User } from '@prisma/client'
import { prisma } from '@/config/database'
import { createUser } from './factories'

export async function cleanDb() {
	await prisma.user.deleteMany({})
	await prisma.save.deleteMany({})
	await prisma.address.deleteMany({})
	await prisma.rating.deleteMany({})
	await prisma.rating.deleteMany({})
	await prisma.profile.deleteMany({})
	await prisma.message.deleteMany({})
	await prisma.chat.deleteMany({})
	await prisma.profileToAddress.deleteMany({})
	await prisma.saveCategory.deleteMany({})
}

export async function createSaveCategories() {
	await prisma.saveCategory.createMany({
		data: [
			{
				name: 'SOFT',
				cost: 1,
			},
			{
				name: 'MEDIUM',
				cost: 3,
			},
			{
				name: 'HARD',
				cost: 5,
			},
		],
	})
}

export async function generateValidToken(user?: User) {
	const incomingUser = user || (await createUser())
	const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET)

	return token
}
