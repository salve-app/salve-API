import { ApplicationError } from '@/utils/interfaces/errors'
import httpStatus from 'http-status'

export function notFound(message: string): ApplicationError {
	return {
		code: httpStatus.NOT_FOUND,
		name: 'NotFound',
		message,
	}
}
