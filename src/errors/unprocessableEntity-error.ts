import {
	ApplicationError,
	MessageErrorWithKey,
} from '@/utils/interfaces/errors'
import httpStatus from 'http-status'

export function unprocessableEntity(
	message: string | Array<MessageErrorWithKey>
): ApplicationError {
	return {
		code: httpStatus.UNPROCESSABLE_ENTITY,
		name: 'UnprocessableEntity',
		message,
	}
}
