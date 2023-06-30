import { internalServerError } from '@/errors'
import { ApplicationError } from '@/utils/interfaces/errors'
import { NextFunction, Request, Response } from 'express'

export async function handleApplicationErrors(
	error: ApplicationError,
	_req: Request,
	res: Response,
	_next: NextFunction
) {
	if (error.code) return res.status(error.code).send(error)

	return res.status(internalServerError().code).send(internalServerError())
}
