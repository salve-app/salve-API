import { unauthorized } from '@/errors'
import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'

export async function authenticateToken(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.header('Authorization')
	if (!authHeader) return generateUnauthorizedResponse(res)

	const token = authHeader.split(' ')[1]
	if (!token) return generateUnauthorizedResponse(res)

	try {
		const { sub } = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload

		req.userId = +sub

		return next()
	} catch (err) {
		return generateUnauthorizedResponse(res)
	}
}

function generateUnauthorizedResponse(res: Response) {
	const { code, message, name } = unauthorized()

	res.status(code).send({ message, name })
}

export type AuthenticatedRequest = Request & UserId
interface UserId {
	userId: number
}
