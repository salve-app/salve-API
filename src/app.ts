import express, { json, Express } from "express";
import cors from "cors";
import loadEnv from "./config/envs";
import { connectPrismaDb } from "./config/database";
import { authRouter, savesRouter, usersRouter } from "./routers";

loadEnv();

const app: Express = express();

app
  .use(cors())
  .use(json())
  .use("/users", usersRouter)
  .use("/saves", savesRouter)
  .use("/auth", authRouter);

export async function init(): Promise<Express> {
  connectPrismaDb();
  return Promise.resolve(app);
}
