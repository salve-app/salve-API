import profileRepository from '@/repositories/profiles-repository'
import userRepository from '@/repositories/users-repository'
import { Address, Profile, User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { createSession } from '../auth-service'
import { conflict, unauthorized } from '@/errors'
import { getAddressByCepOrThrow } from '@/utils/helpers/addresses'
import { badRequest } from '@/errors/badRequest-error'

async function createUser({ username, email, password }: UserInputData) {
	await throwIfEmailOrUsernameExists(username, email)

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
	await throwIfCpfExists(data.cpf)

	await throwIfUserIdExists(userId)

	const { user, coins } = await userRepository.createProfile(data, userId)

	const jwtPayload = {
		username: user.username,
		coins: coins.toNumber(),
		hasProfile: true,
	}

	return { token: await createSession(jwtPayload, userId) }
}

async function createAddress(data: AddressInputData, userId: number) {
	const { coins, user, id: profileId } = await getUserProfileOrThrow(userId)

	await throwIfAddressNotExists(data)

	await profileRepository.createAddress(data, profileId)

	const jwtPayload = {
		profileId,
		username: user.username,
		coins: coins.toNumber(),
		hasProfile: true,
		hasAddress: true,
	}

	return { token: await createSession(jwtPayload, userId) }
}

export default { createUser, createProfile, createAddress }

async function throwIfEmailOrUsernameExists(username: string, email: string) {
	const userResult = await userRepository.findByUsernameOrEmail(username, email)

	if (userResult?.email === email) throw conflict('Email não disponível!')

	if (userResult?.username === username)
		throw conflict('Nome de usuário não disponível!')
}

async function throwIfCpfExists(cpf: string) {
	const profile = await profileRepository.findByCpf(cpf)

	if (profile) throw conflict('Este CPF não está disponível')
}

async function throwIfUserIdExists(userId: number) {
	const profile = await profileRepository.findByUserId(userId)

	if (profile) throw conflict('Usuário já possui perfil cadastrado!')
}

export async function getUserProfileOrThrow(userId: number) {
	const profile = await profileRepository.findByUserId(userId)

	if (!profile) throw unauthorized('O usuário não tem um perfil')

	return profile
}

async function throwIfAddressNotExists(address: AddressInputData) {
	const addressResult = await getAddressByCepOrThrow(address.cep)

	const addressResultIsDifferentFromAddressInput = Object.keys(
		addressResult
	).some((e) => address[e] !== addressResult[e])

	if (addressResultIsDifferentFromAddressInput)
		throw badRequest('Endereço não condiz com o CEP inserido')
}

export type UserInputData = Pick<User, 'email' | 'password' | 'username'>

export type ProfileInputData = Pick<
	Profile,
	'fullName' | 'cpf' | 'gender' | 'birthday' | 'phoneNumber'
>

export type AddressInputData = Omit<Address, 'id' | 'createdAt'> & {
	nickname: string
}
