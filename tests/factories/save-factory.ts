import { prisma } from '@/config/database'
import { faker } from '@faker-js/faker'
import {
	createAddressWithoutNickname,
	generateDistantValidAddress,
	generateValidAddress,
} from './address-factory'
import { SaveCategory } from '@prisma/client'
import { createProfile, createUser, generateValidUser } from './user-factory'

export function validNearbySavesQueryParams() {
	const latitude = (-22.757629).toString()
	const longitude = (-43.446023).toString()
	const range = (2000).toString()

	return new URLSearchParams({ latitude, longitude, range }).toString()
}

export function invalidNearbySavesQueryParams() {
	const latitude = faker.lorem.word()
	const longitude = faker.lorem.word()
	const range = faker.lorem.word()

	return new URLSearchParams({ latitude, longitude, range }).toString()
}

export async function createNearbySave() {
	const validUser = generateValidUser()

	const user = await createUser(validUser)

	const profile = await createProfile(user.id)

	const categories = await getSaveCategories()

	const randomCategory = getRandomArrayElement(categories)

	const addressId = await createAddressWithoutNickname(generateValidAddress())

	return prisma.save.create({
		data: {
			description: faker.commerce.product(),
			requester: {
				connect: {
					id: profile.id,
				},
			},
			address: {
				connect: {
					id: addressId,
				},
			},
			category: {
				connect: {
					id: randomCategory.id,
				},
			},
		},
	})
}

export async function createRequestedSave(profileId: number) {
	const categories = await getSaveCategories()

	const randomCategory = getRandomArrayElement(categories)

	const addressId = await createAddressWithoutNickname(generateValidAddress())

	return prisma.save.create({
		data: {
			description: faker.commerce.product(),
			requester: {
				connect: {
					id: profileId,
				},
			},
			address: {
				connect: {
					id: addressId,
				},
			},
			category: {
				connect: {
					id: randomCategory.id,
				},
			},
		},
	})
}

export async function createProvidedSave(providerId: number) {
	const validUser = generateValidUser()

	const user = await createUser(validUser)

	const { id: requesterId } = await createProfile(user.id)

	const categories = await getSaveCategories()

	const randomCategory = getRandomArrayElement(categories)

	const addressId = await createAddressWithoutNickname(generateValidAddress())

	return prisma.save.create({
		data: {
			description: faker.commerce.product(),
			requester: {
				connect: {
					id: requesterId,
				},
			},
			provider: {
				connect: {
					id: providerId,
				},
			},
			address: {
				connect: {
					id: addressId,
				},
			},
			category: {
				connect: {
					id: randomCategory.id,
				},
			},
		},
	})
}

export async function createDistantSave() {
	const validUser = generateValidUser()

	const user = await createUser(validUser)

	const profile = await createProfile(user.id)

	const categories = await getSaveCategories()

	const randomCategory = getRandomArrayElement(categories)

	const addressId = await createAddressWithoutNickname(
		generateDistantValidAddress()
	)

	return prisma.save.create({
		data: {
			description: faker.commerce.product(),
			requester: {
				connect: {
					id: profile.id,
				},
			},
			address: {
				connect: {
					id: addressId,
				},
			},
			category: {
				connect: {
					id: randomCategory.id,
				},
			},
		},
	})
}

export async function getSaveCategories(): Promise<Array<SaveCategory>> {
	return prisma.saveCategory.findMany({})
}

function getRandomArrayElement(array: Array<SaveCategory>) {
	return array[Math.floor(Math.random() * array.length)]
}
