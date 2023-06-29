export interface ApplicationError {
	code: number
	name: string
	message: string | Array<MessageErrorWithKey>
}

export interface MessageErrorWithKey {
	message: string
	type: string
}
