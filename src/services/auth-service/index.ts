import { unauthorized } from '@/errors'
import userRepository from '@/repositories/users-repository'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

async function signIn(data: SignInParams) {
	const { login, password } = data

	const user = await getUserOrFail(login)

	await validatePasswordOrFail(password, user.password)

	const jwtPayload = {
		profileId: user.Profile?.id,
		username: user.username,
		coins: user.Profile ? user.Profile.coins.toNumber() : 0,
		hasProfile: !!user.Profile,
		hasAddress: !!user.Profile?.ProfileToAddress.length,
	}

	const token = await createSession(jwtPayload, user.id)

	return {
		token,
	}
}

async function getUserOrFail(login: string) {
	const user = await userRepository.findByLogin(login)

	if (!user) throw unauthorized()

	return user
}

export async function createSession(payload: Object, userId: number) {
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: '1d',
		subject: userId.toString(),
	})

	return token
}

async function validatePasswordOrFail(password: string, userPassword: string) {
	const isPasswordValid = await bcrypt.compare(password, userPassword)
	if (!isPasswordValid) throw unauthorized()
}

export type SignInParams = {
	login: string
	password: string
}

export default { signIn }
