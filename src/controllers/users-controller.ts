import { Request, Response } from "express";
import httpStatus from "http-status";
import userService, {
  UserInputData,
  ProfileInputData,
} from "@/services/users-service";
import { AuthenticatedRequest } from "@/middlewares";

export async function createUser(req: Request, res: Response) {
  const userData = req.body as UserInputData;

  try {
    const { token } = await userService.createUser(userData);

    return res.status(httpStatus.CREATED).send({ token });
  } catch (error) {
    if (error.name === "DuplicatedEmailError") {
      return res.status(httpStatus.CONFLICT).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function createProfile(req: AuthenticatedRequest, res: Response) {
  const profileData = req.body as ProfileInputData;
  const { userId } = req;

  try {
    const { token } = await userService.createProfile({...profileData, userId});
    return res.status(httpStatus.CREATED).send({ token });
  } catch (error) {
    if (error.name === "DuplicatedEmailError") {
      return res.status(httpStatus.CONFLICT).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}
