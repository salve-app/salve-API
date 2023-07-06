export interface ChatWithMessages {
	id: number
	acceptedSave: boolean
	messages: Array<Message>
}

export interface Message {
	id: number
	createdAt: Date | string
	message: string
	ownerId: number
}
