import { ApplicationError } from '@/utils/interfaces/errors'
import httpStatus from 'http-status'

export function internalServerError(): ApplicationError {
	return {
		code: httpStatus.INTERNAL_SERVER_ERROR,
		name: 'InternalServerError',
		message: 'Houveram problemas no servidor! Tente novamente mais tarde!',
	}
}
