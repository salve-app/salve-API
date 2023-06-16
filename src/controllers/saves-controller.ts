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
