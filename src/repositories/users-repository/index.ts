import { prisma } from '@/config/database'
import { ProfileInputData, UserInputData } from '@/services/users-service'

async function findByUsernameOrEmail(username: string, email: string) {
	return prisma.user.findFirst({
		where: {
			OR: [{ email }, { username }],
		},
	})
}

async function findByLogin(login: string) {
	return prisma.user.findFirst({
		where: {
			OR: [{ email: login }, { username: login }],
		},
		include: {
			Profile: {
				include: {
					ProfileToAddress: true,
				},
			},
		},
	})
}

async function createUser(data: UserInputData) {
	return prisma.user.create({
		data: {
			...data,
		},
		select: {
			id: true,
			username: true,
			email: true,
		},
	})
}

async function createProfile(data: ProfileInputData, userId: number) {
	return prisma.profile.create({
		data: {
			...data,
			coins: 10,
			userId,
		},
		include: {
			user: {
				select: {
					username: true,
				},
			},
		},
	})
}

export default {
	findByUsernameOrEmail,
	createUser,
	createProfile,
	findByLogin,
}
