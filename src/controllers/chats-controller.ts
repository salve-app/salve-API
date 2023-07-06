import { AuthenticatedRequest } from '@/middlewares'
import chatsService from '@/services/chats-service'
import { MessageInputData } from '@/utils/interfaces/chats'
import { NextFunction, Response } from 'express'
import httpStatus from 'http-status'

export async function getMessagesByChatId(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const chatId = +req.params.id as number

	const { userId } = req

	try {
		const chat = await chatsService.getMessagesByChatId(chatId, userId)

		return res.status(httpStatus.OK).send({ chat })
	} catch (error) {
		next(error)
	}
}

export async function createChatMessage(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const chatId = +req.params.id as number

	const { userId } = req

	const messageData = req.body as MessageInputData

	try {
		await chatsService.createChatMessage(chatId, userId, messageData)

		return res.sendStatus(httpStatus.CREATED)
	} catch (error) {
		next(error)
	}
}

export async function updateProviderAccept(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const chatId = +req.params.id as number

	const { userId } = req

	try {
		await chatsService.updateProviderAccept(chatId, userId)

		return res.sendStatus(httpStatus.OK)
	} catch (error) {
		next(error)
	}
}
