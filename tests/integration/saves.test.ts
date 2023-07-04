import app, { init } from '@/app'
import { cleanDb, createSaveCategories } from '../helpers'
import supertest from 'supertest'
import httpStatus from 'http-status'
import { faker } from '@faker-js/faker'
import {
	createAddress,
	createAddressToken,
	createDistantSave,
	createNearbySave,
	createProfile,
	createProvidedSave,
	createRequestedSave,
	createUser,
	createUserToken,
	generateValidUser,
	invalidNearbySavesQueryParams,
	validNearbySavesQueryParams,
} from '../factories'
import { Save } from '@/utils/interfaces/saves'

beforeAll(async () => {
	await init()
})

beforeEach(async () => {
	await cleanDb()
	await createSaveCategories()
})

const server = supertest(app)

describe('GET /saves', () => {
	const validQuery = validNearbySavesQueryParams()

	it('should respond with status 401 if no token is given', async () => {
		const response = await server.get(`/saves?${validQuery}`)

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	it('should respond with status 401 if given token is not valid', async () => {
		const token = faker.lorem.word()

		const response = await server
			.get(`/saves?${validQuery}`)
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	describe('when token is valid', () => {
		it('should respond with status 200 and nearby saves in range', async () => {
			const validUser = generateValidUser()

			const user = await createUser(validUser)

			const profile = await createProfile(user.id)

			await createAddress(profile.id)

			const token = await createAddressToken(profile, user)

			const nearbySave = await createNearbySave()

			const response = await server
				.get(`/saves?${validQuery}`)
				.set('Authorization', `Bearer ${token}`)

			const resultSave = response.body.nearbySaves[0] as Save

			expect(response.status).toBe(httpStatus.OK)
			expect(response.body.nearbySaves.length).toBe(1)
			expect(resultSave).toMatchObject({
				id: nearbySave.id,
				description: nearbySave.description,
				status: nearbySave.status,
				address: {
					id: nearbySave.addressId,
				},
				category: {
					id: nearbySave.categoryId,
				},
				requester: {
					id: nearbySave.requesterId,
				},
			})
		})

		it('should respond with status 200 and empty array when there are no saves in range', async () => {
			const validUser = generateValidUser()

			const user = await createUser(validUser)

			const profile = await createProfile(user.id)

			await createAddress(profile.id)

			const token = await createAddressToken(profile, user)

			await createDistantSave()

			const response = await server
				.get(`/saves?${validQuery}`)
				.set('Authorization', `Bearer ${token}`)

			expect(response.status).toBe(httpStatus.OK)
			expect(response.body.nearbySaves.length).toBe(0)
		})

		it('should respond with status 401 when user has no profile', async () => {
			const validUser = generateValidUser()

			const user = await createUser(validUser)

			const token = await createUserToken(user)

			const response = await server
				.get(`/saves?${validQuery}`)
				.set('Authorization', `Bearer ${token}`)

			expect(response.status).toBe(httpStatus.UNAUTHORIZED)
		})

		it('should respond with status 400 when query params is invalid', async () => {
			const validUser = generateValidUser()

			const user = await createUser(validUser)

			const profile = await createProfile(user.id)

			await createAddress(profile.id)

			const token = await createAddressToken(profile, user)

			const invalidQuery = invalidNearbySavesQueryParams()

			const response = await server
				.get(`/saves?${invalidQuery}`)
				.set('Authorization', `Bearer ${token}`)

			expect(response.status).toBe(httpStatus.BAD_REQUEST)
		})
	})
})

describe('GET /saves/me/active', () => {
	it('should respond with status 401 if no token is given', async () => {
		const response = await server.get('/saves/me/active')

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	it('should respond with status 401 if given token is not valid', async () => {
		const token = faker.lorem.word()

		const response = await server
			.get('/saves/me/active')
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	describe('when token is valid', () => {
		it('should respond with status 200 and current user saves', async () => {
			const validUser = generateValidUser()

			const user = await createUser(validUser)

			const profile = await createProfile(user.id)

			await createAddress(profile.id)

			const token = await createAddressToken(profile, user)

			const requestedSave = await createRequestedSave(profile.id)

			const providedSave = await createProvidedSave(profile.id)

			const response = await server
				.get('/saves/me/active')
				.set('Authorization', `Bearer ${token}`)

			const resultRequestedSaves = response.body.mySaves.requested[0] as Save

			const resultProvidedSaves = response.body.mySaves.offering[0] as Save

			expect(response.status).toBe(httpStatus.OK)
			expect(resultRequestedSaves).toMatchObject({
				id: requestedSave.id,
				description: requestedSave.description,
				status: requestedSave.status,
				address: {
					id: requestedSave.addressId,
				},
				category: {
					id: requestedSave.categoryId,
				},
				requester: {
					id: requestedSave.requesterId,
				},
			})
			expect(resultProvidedSaves).toMatchObject({
				id: providedSave.id,
				description: providedSave.description,
				status: providedSave.status,
				address: {
					id: providedSave.addressId,
				},
				category: {
					id: providedSave.categoryId,
				},
				requester: {
					id: providedSave.requesterId,
				},
			})
		})

		it('should respond with status 401 when user has no profile', async () => {
			const validUser = generateValidUser()

			const user = await createUser(validUser)

			const token = await createUserToken(user)

			const response = await server
				.get('/saves/me/active')
				.set('Authorization', `Bearer ${token}`)

			expect(response.status).toBe(httpStatus.UNAUTHORIZED)
		})
	})
})

describe('GET /saves/categories', () => {
	it('should respond with status 401 if no token is given', async () => {
		const response = await server.get('/saves/categories')

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	it('should respond with status 401 if given token is not valid', async () => {
		const token = faker.lorem.word()

		const response = await server
			.get('/saves/categories')
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	describe('when token is valid', () => {
		it('should respond with status 200 and save categories', async () => {
			const validUser = generateValidUser()

			const user = await createUser(validUser)

			const profile = await createProfile(user.id)

			await createAddress(profile.id)

			const token = await createAddressToken(profile, user)

			const response = await server
				.get('/saves/categories')
				.set('Authorization', `Bearer ${token}`)

			expect(response.status).toBe(httpStatus.OK)

			expect(response.body.categories).toMatchObject([
				{
					name: 'Suave',
					cost: 1,
				},
				{
					name: 'Da pra aguentar',
					cost: 3,
				},
				{
					name: 'Urgente',
					cost: 5,
				},
			])
		})
	})
})


/*
describe('POST /saves ', () => {

})

describe('GET /saves/:id/chat', () => {})

describe('GET /saves/:id/chat/list', () => {})

describe('POST /saves/:id/chat', () => {})

describe('POST /saves/:id/start', () => {})

describe('POST /saves/:id/finish', () => {}) */
