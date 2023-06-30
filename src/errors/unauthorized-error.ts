import { ApplicationError } from '@/utils/interfaces/errors'
import httpStatus from 'http-status'

export function unauthorized(): ApplicationError {
	return {
		code: httpStatus.UNAUTHORIZED,
		name: 'Unauthorized',
		message: 'Login ou senha inválidos. Tente novamente!',
	}
}
