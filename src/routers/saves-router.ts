import {
	createSave,
	getAllSaveCategories,
	getChatMessages,
	getNearbySaves,
	getMyActiveSaves,
	getSaveChatList,
	updateSaveStatusToInProgress,
	updateSaveStatusToComplete,
} from '@/controllers/saves-controller'
import { authenticateToken, validateBody, validateParams } from '@/middlewares'
import { idSchema, ratingSchema, saveSchema } from '@/schemas'
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
	.put('/:id/start', validateParams(idSchema), updateSaveStatusToInProgress)
	.put(
		'/:id/finish',
		validateParams(idSchema),
		validateBody(ratingSchema),
		updateSaveStatusToComplete
	)

export { savesRouter }
