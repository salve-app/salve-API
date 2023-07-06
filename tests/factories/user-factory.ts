import bcrypt from 'bcrypt'
import { fakerPT_BR as faker } from '@faker-js/faker'
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
			cpf: generateValidCpf(),
			birthday: faker.date.past({ years: 30 }).toISOString(),
			fullName: faker.person.fullName(),
			gender: 'M',
			phoneNumber: faker.phone.number('(##) 9####-####'),
			coins: 10,
			userId,
		},
	})
}

export async function createProfileWithZeroCoins(
	userId: number
): Promise<Profile> {
	return prisma.profile.create({
		data: {
			cpf: generateValidCpf(),
			birthday: faker.date.past({ years: 30 }).toISOString(),
			fullName: faker.person.fullName(),
			gender: 'M',
			phoneNumber: faker.phone.number('(##) 9####-####'),
			coins: 0,
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

const createArray = (total: number, number: number) =>
	Array.from(Array(total), () => numberRandom(number))
const numberRandom = (number: number) => Math.round(Math.random() * number)
const mod = (dividend: number, divisor: number) =>
	Math.round(dividend - Math.floor(dividend / divisor) * divisor)

function generateValidCpf() {
	const total_array = 9
	const n = 9
	const [n1, n2, n3, n4, n5, n6, n7, n8, n9] = createArray(total_array, n)

	let d1 =
		n9 * 2 +
		n8 * 3 +
		n7 * 4 +
		n6 * 5 +
		n5 * 6 +
		n4 * 7 +
		n3 * 8 +
		n2 * 9 +
		n1 * 10
	d1 = 11 - mod(d1, 11)
	if (d1 >= 10) d1 = 0

	let d2 =
		d1 * 2 +
		n9 * 3 +
		n8 * 4 +
		n7 * 5 +
		n6 * 6 +
		n5 * 7 +
		n4 * 8 +
		n3 * 9 +
		n2 * 10 +
		n1 * 11
	d2 = 11 - mod(d2, 11)
	if (d2 >= 10) d2 = 0

	return `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-${d1}${d2}`
}
