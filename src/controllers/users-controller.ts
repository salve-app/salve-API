import { AuthenticatedRequest } from '@/middlewares'
import userService, {
	UserInputData,
	ProfileInputData,
	AddressInputData,
} from '@/services/users-service'
import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'

export async function createUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const userData = req.body as UserInputData

	try {
		const { token } = await userService.createUser(userData)

		return res.status(httpStatus.CREATED).send({ token })
	} catch (error) {
		next(error)
	}
}

export async function createProfile(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const profileData = req.body as ProfileInputData
	const { userId } = req

	try {
		const { token } = await userService.createProfile({ ...profileData }, userId)
		return res.status(httpStatus.CREATED).send({ token })
	} catch (error) {
		next(error)
	}
}

export async function createAddress(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const addressData = req.body as AddressInputData
	const { userId } = req

	try {
		const { token } = await userService.createAddress({ ...addressData }, userId)
		return res.status(httpStatus.CREATED).send({ token })
	} catch (error) {
		next(error)
	}
}
