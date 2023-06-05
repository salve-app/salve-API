import { Request, Response } from "express";
import httpStatus from "http-status";
import userService, { CreateUserParams } from "@/services/users-service";

export async function create(req: Request, res: Response) {
  const { email, password, username } = req.body as CreateUserParams;

  try {
    const user = await userService.createUser({ email, password, username });
    return res.status(httpStatus.CREATED).json({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    if (error.name === "DuplicatedEmailError") {
      return res.status(httpStatus.CONFLICT).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}
