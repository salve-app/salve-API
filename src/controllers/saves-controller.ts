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

export async function getRequestedSaves(
  req: AuthenticatedRequest,
  res: Response
) {
  const {userId} = req;

  try {
    const requestedSaves = await savesService.getRequestedSaves(userId);
    return res.status(httpStatus.OK).send({ requestedSaves });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function getOfferingSaves(
  req: AuthenticatedRequest,
  res: Response
) {
  const {userId} = req;

  try {
    const offeringSaves = await savesService.getOfferingSaves(userId);
    return res.status(httpStatus.OK).send({ offeringSaves });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}