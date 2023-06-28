import {
	getMessagesByChatId,
	updateProviderAccept,
} from '@/controllers/chats-controller'
import { authenticateToken } from '@/middlewares'
import { Router } from 'express'

const chatsRouter = Router()

chatsRouter
	.all('/*', authenticateToken)
	.get('/:id/messages', getMessagesByChatId)
	.put('/:id/accept', updateProviderAccept)

export { chatsRouter }
