import { AuthenticatedRequest } from '@/middlewares'
import savesService from '@/services/saves-service'
import { NextFunction, Response } from 'express'
import httpStatus from 'http-status'

export async function getAllSaveCategories(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const categories = await savesService.getAllSaveCategories()
		return res.status(httpStatus.OK).send({ categories })
	} catch (error) {
		next(error)
	}
}

export async function createSave(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const saveData = req.body

	const { userId } = req

	try {
		await savesService.createSave(saveData, userId)

		return res.sendStatus(httpStatus.CREATED)
	} catch (error) {
		next(error)
	}
}

export async function getMyActiveSaves(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const { userId } = req

	try {
		const mySaves = await savesService.getMyActiveSaves(userId)
		return res.status(httpStatus.OK).send({ mySaves })
	} catch (error) {
		next(error)
	}
}

export async function getNearbySaves(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const latitude = +req.query.latitude
	const longitude = +req.query.longitude
	const range = +req.query.range

	const { userId } = req

	try {
		const nearbySaves = await savesService.getNearbySaves(
			{ latitude, longitude },
			range,
			userId
		)
		return res.status(httpStatus.OK).send({ nearbySaves })
	} catch (error) {
		next(error)
	}
}

export async function getChatMessages(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const saveId = +req.params.id as number

	const { userId } = req

	try {
		const chat = await savesService.getChatMessages(saveId, userId)

		return res.status(httpStatus.OK).send({ chat })
	} catch (error) {
		next(error)
	}
}

export async function getSaveChatList(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const saveId = +req.params.id as number

	const { userId } = req

	try {
		const chatList = await savesService.getSaveChatList(saveId, userId)

		return res.status(httpStatus.OK).send({ chatList })
	} catch (error) {
		next(error)
	}
}

export async function updateSaveStatusToInProgress(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const saveId = +req.params.id as number

	const { userId } = req

	try {
		await savesService.updateSaveStatusToInProgress(saveId, userId)

		return res.sendStatus(httpStatus.OK)
	} catch (error) {
		next(error)
	}
}

export async function updateSaveStatusToComplete(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const saveId = +req.params.id as number

	const { userId } = req

	const { rating } = req.body

	try {
		await savesService.updateSaveStatusToComplete(saveId, rating, userId)

		return res.sendStatus(httpStatus.OK)
	} catch (error) {
		next(error)
	}
}
