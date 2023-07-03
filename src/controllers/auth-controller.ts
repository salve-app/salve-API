import authenticationService, { SignInParams } from '@/services/auth-service'
import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'

export async function singIn(req: Request, res: Response, next: NextFunction) {
	const authInput = req.body as SignInParams

	try {
		const result = await authenticationService.signIn(authInput)

		return res.status(httpStatus.OK).send(result)
	} catch (error) {
		next(error)
	}
}
