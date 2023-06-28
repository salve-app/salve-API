import {
	createSave,
	getAllSaveCategories,
	getChatMessages,
	getNearbySaves,
	getMyActiveSaves,
	getSaveChatList,
	createChatMessage,
	updateSaveStatusToInProgress,
	updateSaveStatusToComplete,
} from '@/controllers/saves-controller'
import { authenticateToken } from '@/middlewares'
import { Router } from 'express'

const savesRouter = Router()

savesRouter
	.all('/*', authenticateToken)
	.post('/', createSave)
	.get('/', getNearbySaves)
	.get('/me/active', getMyActiveSaves)
	.get('/categories', getAllSaveCategories)
	.get('/:id/chat', getChatMessages)
	.get('/:id/chat/list', getSaveChatList)
	.post('/:id/chat', createChatMessage)
	.put('/:id/start', updateSaveStatusToInProgress)
	.put('/:id/finish', updateSaveStatusToComplete)

export { savesRouter }
