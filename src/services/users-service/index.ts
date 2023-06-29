import profileRepository from '@/repositories/profiles-repository'
import userRepository from '@/repositories/users-repository'
import { Address, Profile, User } from '@prisma/client'
import bcrypt from 'bcrypt'

import { createSession } from '../auth-service'

async function createUser({ username, email, password }: UserInputData) {
	await checkEmailOrUsernameExists(username, email)

	const hashedPassword = await bcrypt.hash(password, 10)

	const { id } = await userRepository.createUser({
		username,
		email,
		password: hashedPassword,
	})

	const jwtPayload = {
		username,
	}

	return { token: await createSession(jwtPayload, id) }
}

async function createProfile(data: ProfileInputData, userId: number) {
	const { user, coins } = await userRepository.createProfile(data, userId)

	const jwtPayload = {
		username: user.username,
		coins: +coins,
		hasProfile: true,
	}

	return { token: await createSession(jwtPayload, userId) }
}

async function createAddress(data: AddressInputData, userId: number) {
	const { coins, user, id } = await getUserProfileOrThrow(userId)

	await profileRepository.createAddress(data, id)

	const jwtPayload = {
		profileId: id,
		username: user.username,
		coins: +coins,
		hasProfile: true,
		hasAddress: true,
	}

	return { token: await createSession(jwtPayload, userId) }
}

async function checkEmailOrUsernameExists(username: string, email: string) {
	const userExists = await userRepository.findByUsernameOrEmail(username, email)

	if (userExists) throw new Error('Usuário já existe!')
}

export async function getUserProfileOrThrow(userId: number) {
	const profile = await profileRepository.findByUserId(userId)

	if (!profile) throw new Error('O usuário não tem um perfil')

	return profile
}

export type UserInputData = Pick<User, 'email' | 'password' | 'username'>

export type ProfileInputData = Pick<
	Profile,
	'fullName' | 'cpf' | 'gender' | 'birthday' | 'phoneNumber'
>

export type AddressInputData = Omit<Address, 'id' | 'createdAt'> & {
	nickname: string
}

export default { createUser, createProfile, createAddress }
