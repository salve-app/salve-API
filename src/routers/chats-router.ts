import {
	createChatMessage,
	getMessagesByChatId,
	updateProviderAccept,
} from '@/controllers/chats-controller'
import { authenticateToken, validateBody, validateParams } from '@/middlewares'
import { chatIdSchema, idSchema } from '@/schemas'
import { messageSchema } from '@/schemas/chats-schemas'
import { Router } from 'express'

const chatsRouter = Router()

chatsRouter
	.all('/*', authenticateToken)
	.get('/:id/messages', validateParams(idSchema), getMessagesByChatId)
	.post(
		'/:id/message',
		validateParams(chatIdSchema),
		validateBody(messageSchema),
		createChatMessage
	)
	.put('/:id/accept', validateParams(idSchema), updateProviderAccept)

export { chatsRouter }
