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
	.get('/:id/chat', validateParams(idSchema), getChatMessages)
	.get('/:id/chat/list', validateParams(idSchema), getSaveChatList)
	.post('/:id/chat', validateParams(idSchema), createChatMessage)
	.put('/:id/start', validateParams(idSchema), updateSaveStatusToInProgress)
	.put('/:id/finish', validateParams(idSchema), updateSaveStatusToComplete)

export { savesRouter }
