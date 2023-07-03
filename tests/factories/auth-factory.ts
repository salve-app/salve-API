import { Profile, User } from '@prisma/client'
import jwt from 'jsonwebtoken'

export async function getTokenData(token: string) {
	return jwt.verify(token, process.env.JWT_SECRET)
}

export async function createUserToken({ username, id }: Partial<User>) {
	return jwt.sign({ username }, process.env.JWT_SECRET, {
		expiresIn: '1d',
		subject: id.toString(),
	})
}

export async function createProfileToken(
	{ id: profileId, coins }: Partial<Profile>,
	{ username, id: userId }: Partial<User>
) {
	const jwtPayload = {
		profileId,
		username: username,
		coins: coins.toNumber(),
		hasProfile: true,
	}

	return jwt.sign(jwtPayload, process.env.JWT_SECRET, {
		expiresIn: '1d',
		subject: userId.toString(),
	})
}
