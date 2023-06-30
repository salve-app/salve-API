import { ApplicationError } from '@/utils/interfaces/errors'
import httpStatus from 'http-status'

export function conflict(message: string): ApplicationError {
	return {
		code: httpStatus.CONFLICT,
		name: 'Conflict',
		message,
	}
}
