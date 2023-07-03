import { faker } from '@faker-js/faker'
import httpStatus from 'http-status'
import supertest from 'supertest'
import {
	createProfile,
	createUser,
	generateValidProfile,
	generateValidUser,
	createProfileToken,
	createUserToken,
	getTokenData,
	generateValidAddressWithNickname,
	generateAddressWithInvalidCepFormat,
	generateAddressWithNonExistentCep,
} from '../factories'
import { cleanDb } from '../helpers'
import { prisma } from '@/config/database'
import app, { init } from '@/app'
import { User } from '@prisma/client'

beforeAll(async () => {
	await init()
})

beforeEach(async () => {
	await cleanDb()
})

const server = supertest(app)

describe('POST /users/sign-up', () => {
	it('should respond with status 422 when body is not given', async () => {
		const response = await server.post('/users/sign-up')

		expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
	})

	it('should respond with status 422 when body is not valid', async () => {
		const invalidBody = { [faker.lorem.word()]: faker.lorem.word() }

		const response = await server.post('/users/sign-up').send(invalidBody)

		expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
	})

	describe('when body is valid', () => {
		it('should respond with status 201 and token when success', async () => {
			const body = generateValidUser()

			const beforeInsertCount = await prisma.user.count()

			const response = await server.post('/users/sign-up').send(body)

			const afterInsertCount = await prisma.user.count()

			const { username } = (await getTokenData(response.body.token)) as User

			expect(username).toEqual(body.username)
			expect(beforeInsertCount).toEqual(0)
			expect(afterInsertCount).toEqual(1)
		})

		it('should respond with status 409 when email already exists', async () => {
			const createdUser = await createUser()

			const body = { ...generateValidUser(), email: createdUser.email }

			const response = await server.post('/users/sign-up').send(body)

			expect(response.status).toBe(httpStatus.CONFLICT)

			expect(response.body.name).toBe('Conflict')

			expect(response.body.message).toBe('Email não disponível!')
		})

		it('should respond with status 409 when username already exists', async () => {
			const createdUser = await createUser()

			const body = { ...generateValidUser(), username: createdUser.username }

			const response = await server.post('/users/sign-up').send(body)

			expect(response.status).toBe(httpStatus.CONFLICT)

			expect(response.body.name).toBe('Conflict')

			expect(response.body.message).toBe('Nome de usuário não disponível!')
		})
	})
})

describe('POST /users/sign-up/profile', () => {
	it('should respond with status 401 if no token is given', async () => {
		const response = await server.post('/users/sign-up/profile')

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	it('should respond with status 401 if given token is not valid', async () => {
		const token = faker.lorem.word()

		const response = await server
			.post('/users/sign-up/profile')
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	describe('when token is valid', () => {
		it('should respond with status 422 when body is not given', async () => {
			const user = await createUser()

			const token = await createUserToken(user)

			const response = await server
				.post('/users/sign-up/profile')
				.set('Authorization', `Bearer ${token}`)

			expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
		})

		it('should respond with status 422 when body is not valid', async () => {
			const user = await createUser()

			const token = await createUserToken(user)

			const invalidBody = { [faker.lorem.word()]: faker.lorem.word() }

			const response = await server
				.post('/users/sign-up/profile')
				.send(invalidBody)
				.set('Authorization', `Bearer ${token}`)

			expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
		})

		describe('when body is valid', () => {
			it('should respond with status 201 and token when success', async () => {
				const user = await createUser()

				const token = await createUserToken(user)

				const body = generateValidProfile()

				const beforeInsertCount = await prisma.profile.count()

				const response = await server
					.post('/users/sign-up/profile')
					.send(body)
					.set('Authorization', `Bearer ${token}`)

				const afterInsertCount = await prisma.profile.count()

				const { hasProfile } = (await getTokenData(response.body.token)) as {
					hasProfile: boolean
				}

				expect(hasProfile).toBe(true)

				expect(beforeInsertCount).toEqual(0)
				expect(afterInsertCount).toEqual(1)
			})

			it('should respond with status 409 when cpf already exists', async () => {
				const user = await createUser()

				const token = await createUserToken(user)

				const createdProfile = await createProfile(user.id)

				const body = { ...generateValidProfile(), cpf: createdProfile.cpf }

				const response = await server
					.post('/users/sign-up/profile')
					.send(body)
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.CONFLICT)

				expect(response.body.name).toBe('Conflict')
			})

			it('should respond with status 409 when profile already has a user', async () => {
				const user = await createUser()

				const token = await createUserToken(user)

				await createProfile(user.id)

				const body = generateValidProfile()

				const response = await server
					.post('/users/sign-up/profile')
					.send(body)
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.CONFLICT)

				expect(response.body.name).toBe('Conflict')
			})
		})
	})
})

describe('POST /users/sign-up/address', () => {
	it('should respond with status 401 if no token is given', async () => {
		const response = await server.post('/users/sign-up/address')

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	it('should respond with status 401 if given token is not valid', async () => {
		const token = faker.lorem.word()

		const response = await server
			.post('/users/sign-up/address')
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toBe(httpStatus.UNAUTHORIZED)
	})

	describe('when token is valid', () => {
		it('should respond with status 422 when body is not given', async () => {
			const user = await createUser()

			const profile = await createProfile(user.id)

			const token = await createProfileToken(profile, user)

			const response = await server
				.post('/users/sign-up/address')
				.set('Authorization', `Bearer ${token}`)

			expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
		})

		it('should respond with status 422 when body is not valid', async () => {
			const user = await createUser()

			const profile = await createProfile(user.id)

			const token = await createProfileToken(profile, user)

			const invalidBody = { [faker.lorem.word()]: faker.lorem.word() }

			const response = await server
				.post('/users/sign-up/address')
				.send(invalidBody)
				.set('Authorization', `Bearer ${token}`)

			expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
		})

		describe('when body is valid', () => {
			it('should respond with status 201 and token when success', async () => {
				const user = await createUser()

				const profile = await createProfile(user.id)

				const token = await createProfileToken(profile, user)

				const body = generateValidAddressWithNickname()

				const beforeInsertCount = await prisma.address.count()

				const response = await server
					.post('/users/sign-up/address')
					.send(body)
					.set('Authorization', `Bearer ${token}`)

				const afterInsertCount = await prisma.address.count()

				const { hasAddress } = (await getTokenData(response.body.token)) as {
					hasAddress: boolean
				}

				expect(hasAddress).toBe(true)

				expect(beforeInsertCount).toEqual(0)
				expect(afterInsertCount).toEqual(1)
			})

			it('should respond with status 401 when user has no profile', async () => {
				const user = await createUser()

				const token = await createUserToken(user)

				const body = generateValidAddressWithNickname()

				const response = await server
					.post('/users/sign-up/address')
					.send(body)
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.UNAUTHORIZED)
			})

			it('should respond with status 422 when CEP format is wrong', async () => {
				const user = await createUser()

				const profile = await createProfile(user.id)

				const token = await createProfileToken(profile, user)

				const body = generateAddressWithInvalidCepFormat()

				const response = await server
					.post('/users/sign-up/address')
					.send(body)
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
			})

			it('should respond with status 400 when non-existent CEP is entered', async () => {
				const user = await createUser()

				const profile = await createProfile(user.id)

				const token = await createProfileToken(profile, user)

				const body = generateAddressWithNonExistentCep()

				const response = await server
					.post('/users/sign-up/address')
					.send(body)
					.set('Authorization', `Bearer ${token}`)

				expect(response.status).toBe(httpStatus.BAD_REQUEST)
			})
		})
	})
})
