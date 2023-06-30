import { ApplicationError } from '@/utils/interfaces/errors'
import httpStatus from 'http-status'

export function badRequest(message: string): ApplicationError {
	return {
		code: httpStatus.BAD_REQUEST,
		name: 'BadRequest',
		message,
	}
}
