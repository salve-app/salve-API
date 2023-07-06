import app, { init } from '@/app'
import { cleanDb, createSaveCategories } from '../helpers'
import supertest from 'supertest'
import httpStatus from 'http-status'
import { faker } from '@faker-js/faker'
import {
	createAddress,
	createAddressToken,
	createChatWithMessage,
	createProfile,
	createProvidedSave,
	createRequestedSave,
	createUser,
	createUserToken,
	generateValidUser,
} from '../factories'
import { prisma } from '@/config/database'

beforeAll(async () => {
	await init()
})

beforeEach(async () => {
	await cleanDb()
	await createSaveCategories()
})

const server = supertest(app)

describe('GET /chats/:id/messages', () => {
	it('should respond with status 401 if no token is given', async () => {
		const response = await server.get('/chats/0/messages')

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	it('should respond with status 401 if given token is not valid', async () => {
		const token = faker.lorem.word()

		const response = await server
			.get('/chats/0/messages')
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
				.get('/chats/0/messages')
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

				const { id: chatId, messages } = await createChatWithMessage(
					saveId,
					requesterId,
					profile.id
				)

				const response = await server
					.get(`/chats/${chatId}/messages`)
					.set('Authorization', `Bearer ${token}`)

				const responseChatMessages = response.body.chat

				expect(response.status).toBe(httpStatus.OK)

				expect(responseChatMessages).toMatchObject({
					acceptedSave: false,
					provider: { id: profile.id, fullName: profile.fullName },
					messages: [
						{
							...messages[0],
							createdAt: messages[0].createdAt.toISOString(),
						},
					],
				})
			})

			it('should respond with status 401 when user has no profile', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const token = await createUserToken(user)

				const response = await server
					.get('/chats/1/messages')
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
					.get('/chats/1/messages')
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.NOT_FOUND)
			})

			it('should respond with status 403 when user access other users chats', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const profile = await createProfile(user.id)

				await createAddress(profile.id)

				const token = await createAddressToken(profile, user)

				const otherUser = await createUser(generateValidUser())

				const otherProfile = await createProfile(otherUser.id)

				const { id: saveId, requesterId } = await createProvidedSave(
					otherProfile.id
				)

				const { id: chatId } = await createChatWithMessage(
					saveId,
					requesterId,
					otherProfile.id
				)

				const response = await server
					.get(`/chats/${chatId}/messages`)
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.FORBIDDEN)
			})
		})
	})
})

describe('POST /chats/:id/message ', () => {
	it('should respond with status 401 if no token is given', async () => {
		const response = await server.post('/chats/-1/message')

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	it('should respond with status 401 if given token is not valid', async () => {
		const token = faker.lorem.word()

		const response = await server
			.post('/chats/-1/message')
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
				.post('/chats/-1/message')
				.set('Authorization', `Bearer ${token}`)

			expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
		})

		describe('when id param is valid', () => {
			it('should respond with status 422 when body is not given', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const profile = await createProfile(user.id)

				await createAddress(profile.id)

				const token = await createAddressToken(profile, user)

				const response = await server
					.post('/chats/1/message')
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
					.post('/chats/1/message')
					.send(invalidBody)
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
			})

			describe('when body is valid', () => {
				it('should respond with status 200 and create chat message', async () => {
					const validUser = generateValidUser()

					const user = await createUser(validUser)

					const profile = await createProfile(user.id)

					await createAddress(profile.id)

					const token = await createAddressToken(profile, user)

					const { id: saveId } = await createProvidedSave(profile.id)

					const body = { message: faker.lorem.text(), saveId }

					const beforeInsertCount = await prisma.chat.count()

					const response = await server
						.post('/chats/0/message')
						.set('Authorization', `Bearer ${token}`)
						.send(body)

					const afterInsertCount = await prisma.chat.count()

					expect(beforeInsertCount).toBe(0)

					expect(afterInsertCount).toBe(1)

					expect(response.status).toBe(httpStatus.CREATED)
				})

				it('should respond with status 401 when user has no profile', async () => {
					const validUser = generateValidUser()

					const user = await createUser(validUser)

					const token = await createUserToken(user)

					const body = { message: faker.lorem.text(), saveId: 1 }

					const response = await server
						.post('/chats/1/message')
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

					const body = { message: faker.lorem.text(), saveId: 1 }

					const response = await server
						.post('/chats/1/message')
						.set('Authorization', `Bearer ${token}`)
						.send(body)

					expect(response.status).toBe(httpStatus.NOT_FOUND)
				})
			})
		})
	})
})

describe('PUT /chats/:id/accept ', () => {
	it('should respond with status 401 if no token is given', async () => {
		const response = await server.put('/chats/-1/accept')

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	it('should respond with status 401 if given token is not valid', async () => {
		const token = faker.lorem.word()

		const response = await server
			.put('/chats/-1/accept')
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
				.put('/chats/-1/accept')
				.set('Authorization', `Bearer ${token}`)

			expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
		})

		describe('when id param is valid', () => {
			it('should respond with status 200 and update acceptedSave to true', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const profile = await createProfile(user.id)

				await createAddress(profile.id)

				const token = await createAddressToken(profile, user)

				const { id: saveId, requesterId } = await createRequestedSave(profile.id)

				const otherUser = await createUser(generateValidUser())

				const otherProfile = await createProfile(otherUser.id)

				const { id: chatId } = await createChatWithMessage(
					saveId,
					requesterId,
					otherProfile.id
				)

				const response = await server
					.put(`/chats/${chatId}/accept`)
					.set('Authorization', `Bearer ${token}`)

				const afterUpdate = await prisma.chat.findUnique({ where: { id: chatId } })

				expect(afterUpdate.acceptedSave).toBe(true)

				expect(response.status).toBe(httpStatus.OK)
			})

			it('should respond with status 401 when user has no profile', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const token = await createUserToken(user)

				const response = await server
					.put('/chats/1/accept')
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.UNAUTHORIZED)
			})

			it('should respond with status 404 when non existent chatId is entered', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const profile = await createProfile(user.id)

				await createAddress(profile.id)

				const token = await createAddressToken(profile, user)

				const response = await server
					.put('/chats/1/accept')
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.NOT_FOUND)
			})

			it('should respond with status 403 when current user is not requester', async () => {
				const validUser = generateValidUser()

				const user = await createUser(validUser)

				const profile = await createProfile(user.id)

				await createAddress(profile.id)

				const token = await createAddressToken(profile, user)

				const {
					id: saveId,
					requesterId,
					providerId,
				} = await createProvidedSave(profile.id)

				const { id: chatId } = await createChatWithMessage(
					saveId,
					requesterId,
					providerId
				)

				const response = await server
					.put(`/chats/${chatId}/accept`)
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.FORBIDDEN)
			})
		})
	})
})
