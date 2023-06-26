/*
  Warnings:

  - A unique constraint covering the columns `[saveId,requesterId,providerId]` on the table `chats` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "chats_saveId_requesterId_providerId_key" ON "chats"("saveId", "requesterId", "providerId");
