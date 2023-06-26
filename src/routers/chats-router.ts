import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getMessagesByChatId, updateProviderAccept } from "@/controllers/chats-controller";

const chatsRouter = Router();

chatsRouter
  .all("/*", authenticateToken)
  .get("/:id/messages", getMessagesByChatId).put('/:id/accept', updateProviderAccept);

export { chatsRouter };
