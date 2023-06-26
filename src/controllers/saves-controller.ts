import { AuthenticatedRequest } from "@/middlewares";
import savesService from "@/services/saves-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getAllSaveCategories(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const categories = await savesService.getAllSaveCategories();
    return res.status(httpStatus.OK).send({ categories });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function createSave(req: AuthenticatedRequest, res: Response) {
  const saveData = req.body;

  const { userId } = req;

  try {
    await savesService.createSave(saveData, userId);

    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function getMyActiveSaves(
  req: AuthenticatedRequest,
  res: Response
) {
  const { userId } = req;

  try {
    const mySaves = await savesService.getMyActiveSaves(userId);
    return res.status(httpStatus.OK).send({ mySaves });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function getNearbySaves(req: AuthenticatedRequest, res: Response) {
  const latitude = +req.query.latitude;
  const longitude = +req.query.longitude;
  const range = +req.query.range;

  const { userId } = req;

  try {
    const nearbySaves = await savesService.getNearbySaves(
      { latitude, longitude },
      range,
      userId
    );
    return res.status(httpStatus.OK).send({ nearbySaves });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function getChatMessages(
  req: AuthenticatedRequest,
  res: Response
) {
  const saveId = +req.params.id as number;

  const { userId } = req;

  try {
    const chat = await savesService.getChatMessages(saveId, userId);

    return res.status(httpStatus.OK).send({ chat });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function getSaveChatList(
  req: AuthenticatedRequest,
  res: Response
) {
  const saveId = +req.params.id as number;

  const { userId } = req;

  try {
    const chatList = await savesService.getSaveChatList(saveId, userId);
    
    return res.status(httpStatus.OK).send({ chatList });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function createChatMessage(
  req: AuthenticatedRequest,
  res: Response
) {
  const saveId = +req.params.id as number;

  const { userId } = req;

  const messageData = req.body as MessageInputData;

  try {
    await savesService.createChatMessage(saveId, userId, messageData);

    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}
export interface MessageInputData {
  chatId: number
  profileId: number
  message: string
}