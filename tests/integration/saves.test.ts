import app, { init } from '@/app'
import { cleanDb, createSaveCategories } from '../helpers'
import supertest from 'supertest'
import httpStatus from 'http-status'
import { faker } from '@faker-js/faker'
import {
	createAddress,
	createAddressToken,
	createChatWithMessage,
	createChatWithMessageAndAcceptedSave,
	createDistantSave,
	createInProgressSave,
	createNearbySave,
	createProfile,
	createProfileToken,
	createProfileWithZeroCoins,
	createProvidedSave,
	createRequestedInProgressSave,
	createRequestedSave,
	createSave,
	createUser,
	createUserToken,
	generateRandomRating,
	generateSaveBodyWithInvalidCep,
	generateValidSaveBody,
	generateValidUser,
	invalidNearbySavesQueryParams,
	validNearbySavesQueryParams,
} from '../factories'
import { Save } from '@/utils/interfaces/saves'
import { prisma } from '@/config/database'
import { ChatWithMessages } from '@/utils/interfaces/chats'

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

describe('POST /saves ', () => {
	it('should respond with status 401 if no token is given', async () => {
		const response = await server.post('/saves')

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	it('should respond with status 401 if given token is not valid', async () => {
		const token = faker.lorem.word()

		const response = await server
			.post('/saves')
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})
	describe('when token is valid', () => {
		it('should respond with status 422 when body is not given', async () => {
			const validUser = generateValidUser()

			const user = await createUser(validUser)

			const profile = await createProfile(user.id)

			await createAddress(profile.id)

			const token = await createAddressToken(profile, user)

			const response = await server
				.post('/saves')
				.set('Authorization', `Bearer ${token}`)

			expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
		})

		it('should respond with status 422 when body is not valid', async () => {
			const validUser = generateValidUser()

			const user = await createUser(validUser)

			const profile = await createProfile(user.id)

			await createAddress(profile.id)

			const token = await createAddressToken(profile, user)

			const invalidBody = { [faker.lorem.word()]: faker.lorem.word() }

			const response = await server
				.post('/saves')
				.send(invalidBody)
				.set('Authorization', `Bearer ${token}`)

			expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
		})

		describe('when body is valid', () => {
			it('should respond with status 201 when save is created', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const profile = await createProfile(user.id)

				await createAddress(profile.id)

				const token = await createAddressToken(profile, user)

				const body = await generateValidSaveBody()

				const beforeInsertCount = await prisma.save.count()

				const response = await server
					.post('/saves')
					.send(body)
					.set('Authorization', `Bearer ${token}`)

				const afterInsertCount = await prisma.save.count()

				expect(response.status).toBe(httpStatus.CREATED)

				expect(beforeInsertCount).toBe(0)

				expect(afterInsertCount).toBe(1)
			})

			it('should respond with status 401 when user has no profile', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const token = await createUserToken(user)

				const body = await generateValidSaveBody()

				const response = await server
					.post('/saves')
					.send(body)
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.UNAUTHORIZED)
			})

			it('should respond with status 422 when save address CEP is not valid', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const profile = await createProfileWithZeroCoins(user.id)

				await createAddress(profile.id)

				const token = await createAddressToken(profile, user)

				const body = await generateSaveBodyWithInvalidCep()

				const response = await server
					.post('/saves')
					.send(body)
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
			})

			it('should respond with status 400 when user coins are insufficient', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const profile = await createProfileWithZeroCoins(user.id)

				await createAddress(profile.id)

				const token = await createAddressToken(profile, user)

				const body = await generateValidSaveBody()

				const response = await server
					.post('/saves')
					.send(body)
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.BAD_REQUEST)
			})
		})
	})
})

describe('GET /saves/:id/chat', () => {
	it('should respond with status 401 if no token is given', async () => {
		const response = await server.get('/saves/0/chat')

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	it('should respond with status 401 if given token is not valid', async () => {
		const token = faker.lorem.word()

		const response = await server
			.get('/saves/0/chat')
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	describe('when token is valid', () => {
		it('should respond with status 422 if id param is not valid', async () => {
			const validUser = generateValidUser()

			const user = await createUser(validUser)

			const profile = await createProfile(user.id)

			await createAddress(profile.id)

			const token = await createAddressToken(profile, user)

			const response = await server
				.get('/saves/0/chat')
				.set('Authorization', `Bearer ${token}`)

			expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
		})

		describe('when id param is valid', () => {
			it('should respond with status 200 and save chat', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const profile = await createProfile(user.id)

				await createAddress(profile.id)

				const token = await createAddressToken(profile, user)

				const { id: saveId, requesterId } = await createProvidedSave(profile.id)

				const chat = await createChatWithMessage(saveId, requesterId, profile.id)

				const response = await server
					.get(`/saves/${saveId}/chat`)
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.OK)

				expect(response.body.chat).toMatchObject<ChatWithMessages>({
					id: chat.id,
					acceptedSave: chat.acceptedSave,
					messages: [
						{
							...chat.messages[0],
							createdAt: chat.messages[0].createdAt.toISOString(),
						},
					],
				})
			})

			it('should respond with status 404 when non existent saveId is entered', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const profile = await createProfile(user.id)

				await createAddress(profile.id)

				const token = await createAddressToken(profile, user)

				const response = await server
					.get('/saves/1/chat')
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.NOT_FOUND)
			})

			it('should respond with status 401 when user has no profile', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const token = await createUserToken(user)

				const response = await server
					.get('/saves/1/chat')
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.UNAUTHORIZED)
			})
		})
	})
})

describe('GET /saves/:id/chat/list', () => {
	it('should respond with status 401 if no token is given', async () => {
		const response = await server.get('/saves/0/chat/list')

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	it('should respond with status 401 if given token is not valid', async () => {
		const token = faker.lorem.word()

		const response = await server
			.get('/saves/0/chat/list')
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	describe('when token is valid', () => {
		it('should respond with status 422 if id param is not valid', async () => {
			const validUser = generateValidUser()

			const user = await createUser(validUser)

			const profile = await createProfile(user.id)

			await createAddress(profile.id)

			const token = await createAddressToken(profile, user)

			const response = await server
				.get('/saves/0/chat/list')
				.set('Authorization', `Bearer ${token}`)

			expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
		})

		describe('when id param is valid', () => {
			it('should respond with status 200 and save chat list', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const profile = await createProfile(user.id)

				await createAddress(profile.id)

				const token = await createAddressToken(profile, user)

				const { id: saveId, requesterId } = await createRequestedSave(profile.id)

				const providerUser = await createUser(generateValidUser())

				const providerProfile = await createProfile(providerUser.id)

				const chat = await createChatWithMessage(
					saveId,
					requesterId,
					providerProfile.id
				)

				const response = await server
					.get(`/saves/${saveId}/chat/list`)
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.OK)

				expect(response.body.chatList).toMatchObject([
					{
						id: chat.id,
						provider: {
							id: providerProfile.id,
							fullName: providerProfile.fullName,
						},
						lastMessage: chat.messages[chat.messages.length - 1].message,
					},
				])
			})

			it('should respond with status 404 when non existent saveId is entered', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const profile = await createProfile(user.id)

				await createAddress(profile.id)

				const token = await createAddressToken(profile, user)

				const response = await server
					.get('/saves/1/chat/list')
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.NOT_FOUND)
			})

			it('should respond with status 401 when user has no profile', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const token = await createUserToken(user)

				const response = await server
					.get('/saves/1/chat/list')
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.UNAUTHORIZED)
			})
		})
	})
})

describe('PUT /saves/:id/start', () => {
	it('should respond with status 401 if no token is given', async () => {
		const response = await server.put('/saves/0/start')

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	it('should respond with status 401 if given token is not valid', async () => {
		const token = faker.lorem.word()

		const response = await server
			.put('/saves/0/start')
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	describe('when token is valid', () => {
		it('should respond with status 422 if id param is not valid', async () => {
			const validUser = generateValidUser()

			const user = await createUser(validUser)

			const profile = await createProfile(user.id)

			await createAddress(profile.id)

			const token = await createAddressToken(profile, user)

			const response = await server
				.put('/saves/0/start')
				.set('Authorization', `Bearer ${token}`)

			expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
		})

		describe('when id param is valid', () => {
			it('should respond with status 200 when save status is changed to IN_PROGRESS', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const profile = await createProfile(user.id)

				await createAddress(profile.id)

				const token = await createAddressToken(profile, user)

				const { id: saveId, requesterId, status } = await createSave()

				await createChatWithMessageAndAcceptedSave(saveId, requesterId, profile.id)

				const beforeSaveStatus = status

				const response = await server
					.put(`/saves/${saveId}/start`)
					.set('Authorization', `Bearer ${token}`)

				const afterSaveStatus = (
					await prisma.save.findUnique({
						where: { id: saveId },
					})
				).status

				expect(response.status).toBe(httpStatus.OK)
				expect(beforeSaveStatus).toBe('CREATED')
				expect(afterSaveStatus).toBe('IN_PROGRESS')
			})

			it('should respond with status 401 when user has no profile', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const token = await createUserToken(user)

				const response = await server
					.put('/saves/1/start')
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.UNAUTHORIZED)
			})

			it('should respond with status 404 when non existent saveId is entered', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const profile = await createProfile(user.id)

				await createAddress(profile.id)

				const token = await createAddressToken(profile, user)

				const response = await server
					.put('/saves/1/start')
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.NOT_FOUND)
			})

			it('should respond with status 400 when save status is not CREATED', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const profile = await createProfile(user.id)

				await createAddress(profile.id)

				const token = await createAddressToken(profile, user)

				const { id: saveId } = await createInProgressSave()

				const response = await server
					.put(`/saves/${saveId}/start`)
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.BAD_REQUEST)
			})

			it('should respond with status 404 when save has no chat with provider user', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const profile = await createProfile(user.id)

				await createAddress(profile.id)

				const token = await createAddressToken(profile, user)

				const { id: saveId } = await createSave()

				const response = await server
					.put(`/saves/${saveId}/start`)
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.NOT_FOUND)
			})

			it('should respond with status 400 when save is not accepted by requester user', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const profile = await createProfile(user.id)

				await createAddress(profile.id)

				const token = await createAddressToken(profile, user)

				const { id: saveId, requesterId } = await createSave()

				await createChatWithMessage(saveId, requesterId, profile.id)

				const response = await server
					.put(`/saves/${saveId}/start`)
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.BAD_REQUEST)
			})
		})
	})
})

describe('PUT /saves/:id/finish', () => {
	it('should respond with status 401 if no token is given', async () => {
		const response = await server.put('/saves/0/finish')

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	it('should respond with status 401 if given token is not valid', async () => {
		const token = faker.lorem.word()

		const response = await server
			.put('/saves/0/finish')
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	describe('when token is valid', () => {
		it('should respond with status 422 if id param is not valid', async () => {
			const validUser = generateValidUser()

			const user = await createUser(validUser)

			const profile = await createProfile(user.id)

			await createAddress(profile.id)

			const token = await createAddressToken(profile, user)

			const response = await server
				.put('/saves/0/finish')
				.set('Authorization', `Bearer ${token}`)

			expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
		})

		describe('when id param is valid', () => {
			it('should respond with status 422 when body is not given', async () => {
				const user = await createUser()

				const profile = await createProfile(user.id)

				const token = await createProfileToken(profile, user)

				const response = await server
					.put('/saves/1/finish')
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
			})

			it('should respond with status 422 when body is not valid', async () => {
				const user = await createUser()

				const profile = await createProfile(user.id)

				const token = await createProfileToken(profile, user)

				const invalidBody = { [faker.lorem.word()]: faker.lorem.word() }

				const response = await server
					.put('/saves/1/finish')
					.send(invalidBody)
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
			})

			describe('when body is valid', () => {
				it('should respond with status 200 when save status is changed to COMPLETE', async () => {
					const validUser = generateValidUser()

					const user = await createUser(validUser)

					const profile = await createProfile(user.id)

					await createAddress(profile.id)

					const token = await createAddressToken(profile, user)

					const {
						id: saveId,
						requesterId,
						status,
					} = await createRequestedInProgressSave(profile.id)

					await createChatWithMessageAndAcceptedSave(saveId, requesterId, profile.id)

					const body = generateRandomRating()

					const beforeSaveStatus = status

					const response = await server
						.put(`/saves/${saveId}/finish`)
						.set('Authorization', `Bearer ${token}`)
						.send(body)

					const afterSaveStatus = (
						await prisma.save.findUnique({
							where: { id: saveId },
						})
					).status

					expect(response.status).toBe(httpStatus.OK)
					expect(beforeSaveStatus).toBe('IN_PROGRESS')
					expect(afterSaveStatus).toBe('COMPLETED')
				})

				it('should respond with status 401 when user has no profile', async () => {
					const validUser = generateValidUser()

					const user = await createUser(validUser)

					const token = await createUserToken(user)

					const body = generateRandomRating()

					const response = await server
						.put('/saves/1/finish')
						.set('Authorization', `Bearer ${token}`)
						.send(body)

					expect(response.status).toBe(httpStatus.UNAUTHORIZED)
				})

				it('should respond with status 404 when non existent saveId is entered', async () => {
					const validUser = generateValidUser()

					const user = await createUser(validUser)

					const profile = await createProfile(user.id)

					await createAddress(profile.id)

					const token = await createAddressToken(profile, user)

					const body = generateRandomRating()

					const response = await server
						.put('/saves/1/finish')
						.set('Authorization', `Bearer ${token}`)
						.send(body)

					expect(response.status).toBe(httpStatus.NOT_FOUND)
				})

				it('should respond with status 400 when save status is not COMPLETE', async () => {
					const validUser = generateValidUser()

					const user = await createUser(validUser)

					const profile = await createProfile(user.id)

					await createAddress(profile.id)

					const token = await createAddressToken(profile, user)

					const { id: saveId } = await createRequestedSave(profile.id)

					const body = generateRandomRating()

					const response = await server
						.put(`/saves/${saveId}/finish`)
						.set('Authorization', `Bearer ${token}`)
						.send(body)

					expect(response.status).toBe(httpStatus.BAD_REQUEST)
				})

				it('should respond with status 403 when user is not save requester', async () => {
					const validUser = generateValidUser()

					const user = await createUser(validUser)

					const profile = await createProfile(user.id)

					await createAddress(profile.id)

					const token = await createAddressToken(profile, user)

					const { id: saveId } = await createInProgressSave()

					const body = generateRandomRating()

					const response = await server
						.put(`/saves/${saveId}/finish`)
						.set('Authorization', `Bearer ${token}`)
						.send(body)

					expect(response.status).toBe(httpStatus.FORBIDDEN)
				})
			})
		})
	})
})
