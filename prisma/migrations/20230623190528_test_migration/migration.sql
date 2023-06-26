-- DropForeignKey
ALTER TABLE "saves" DROP CONSTRAINT "saves_addressId_fkey";

-- DropForeignKey
ALTER TABLE "saves" DROP CONSTRAINT "saves_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "saves" DROP CONSTRAINT "saves_providerId_fkey";

-- DropForeignKey
ALTER TABLE "saves" DROP CONSTRAINT "saves_ratingsId_fkey";

-- DropForeignKey
ALTER TABLE "saves" DROP CONSTRAINT "saves_requesterId_fkey";

-- CreateTable
CREATE TABLE "chats" (
    "id" SERIAL NOT NULL,
    "requesterId" INTEGER NOT NULL,
    "providerId" INTEGER NOT NULL,
    "saveId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "chatId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "saves" ADD CONSTRAINT "saves_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saves" ADD CONSTRAINT "saves_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "saves_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saves" ADD CONSTRAINT "saves_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saves" ADD CONSTRAINT "saves_ratingsId_fkey" FOREIGN KEY ("ratingsId") REFERENCES "ratings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saves" ADD CONSTRAINT "saves_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_saveId_fkey" FOREIGN KEY ("saveId") REFERENCES "saves"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
