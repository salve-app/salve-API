import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'
import { Profile, User } from '@prisma/client'
import { prisma } from '@/config/database'

export async function createUser(params: Partial<User> = {}): Promise<User> {
	const incomingPassword = params.password || faker.internet.password(8)
	const hashedPassword = await bcrypt.hash(incomingPassword, 10)

	return prisma.user.create({
		data: {
			username: params.username || faker.internet.displayName(),
			email: params.email || faker.internet.email(),
			password: hashedPassword,
		},
	})
}

export async function createProfile(userId: number): Promise<Profile> {
	return prisma.profile.create({
		data: {
			cpf: '534.842.780-21',
			birthday: faker.date.past({ years: 30 }).toISOString(),
			fullName: faker.person.fullName(),
			gender: 'M',
			phoneNumber: faker.phone.number('(##) 9####-####'),
			coins: 10,
			userId,
		},
	})
}

export function generateValidUser() {
	return {
		username: faker.internet.displayName(),
		email: faker.internet.email(),
		password: faker.internet.password(8),
	}
}

export function generateValidProfile() {
	return {
		cpf: '791.500.070-50',
		birthday: faker.date.past({ years: 30 }),
		fullName: faker.person.fullName(),
		gender: 'M',
		phoneNumber: faker.phone.number('(##) 9####-####'),
	}
}
