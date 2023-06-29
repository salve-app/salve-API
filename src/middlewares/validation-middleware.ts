import { unprocessableEntity } from '@/errors'
import { NextFunction, Request, Response } from 'express'
import { ObjectSchema } from 'joi'

export function validateBody<T>(schema: ObjectSchema<T>): ValidationMiddleware {
	return validate(schema, 'body')
}

export function validateParams<T>(
	schema: ObjectSchema<T>
): ValidationMiddleware {
	return validate(schema, 'params')
}

function validate(schema: ObjectSchema, type: 'body' | 'params') {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error } = schema.validate(req[type], {
			abortEarly: false,
		})

		if (!error) {
			next()
		} else {
			const { code, message, name } = unprocessableEntity(
				error.details.map((d) => ({ message: d.message, type: d.context.key }))
			)

			res.status(code).send({ name, message })
		}
	}
}

type ValidationMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => void
