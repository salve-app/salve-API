import { ApplicationError } from '@/utils/interfaces/errors'
import httpStatus from 'http-status'

export function unauthorized(message?: string): ApplicationError {
	return {
		code: httpStatus.UNAUTHORIZED,
		name: 'Unauthorized',
		message: message || 'Login ou senha inválidos. Tente novamente!',
	}
}
