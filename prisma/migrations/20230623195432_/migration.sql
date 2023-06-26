/*
  Warnings:

  - A unique constraint covering the columns `[saveId,providerId]` on the table `chats` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "chats_saveId_requesterId_providerId_key";

-- CreateIndex
CREATE UNIQUE INDEX "chats_saveId_providerId_key" ON "chats"("saveId", "providerId");
