import { AuthenticatedRequest } from "@/middlewares";
import chatsService from "@/services/chats-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getMessagesByChatId(
  req: AuthenticatedRequest,
  res: Response
) {
  const chatId = +req.params.id as number;

  const { userId } = req;

  try {
    const chat = await chatsService.getMessagesByChatId(chatId, userId);

    return res.status(httpStatus.OK).send({ chat });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function updateProviderAccept(
  req: AuthenticatedRequest,
  res: Response
) {
  const chatId = +req.params.id as number;

  const { userId } = req;

  try {
    const chat = await chatsService.updateProviderAccept(chatId, userId);

    return res.status(httpStatus.OK).send({ chat });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}
