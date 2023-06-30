import { ApplicationError } from '@/utils/interfaces/errors'
import httpStatus from 'http-status'

export function forbidden(message: string): ApplicationError {
	return {
		code: httpStatus.FORBIDDEN,
		name: 'Forbidden',
		message,
	}
}
