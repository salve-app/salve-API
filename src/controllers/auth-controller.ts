import { Request, Response } from "express";
import httpStatus from "http-status";
import authenticationService, { SignInParams } from "@/services/auth-service";

export async function singIn(req: Request, res: Response) {
  const authInput = req.body as SignInParams;

  try {
    const result = await authenticationService.signIn(authInput);

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}
