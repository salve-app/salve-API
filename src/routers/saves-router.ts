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
import { authenticateToken, validateBody, validateParams } from '@/middlewares'
import { idSchema, saveSchema } from '@/schemas'
import { Router } from 'express'

const savesRouter = Router()

savesRouter
	.all('/*', authenticateToken)
	.get('/', getNearbySaves)
	.get('/me/active', getMyActiveSaves)
	.get('/categories', getAllSaveCategories)
	.post('/', validateBody(saveSchema), createSave)
	.use(validateParams(idSchema))
	.get('/:id/chat', getChatMessages)
	.get('/:id/chat/list', getSaveChatList)
	.post('/:id/chat', createChatMessage)
	.put('/:id/start', updateSaveStatusToInProgress)
	.put('/:id/finish', updateSaveStatusToComplete)

export { savesRouter }
