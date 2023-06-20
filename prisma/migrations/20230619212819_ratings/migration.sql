-- DropForeignKey
ALTER TABLE "saves" DROP CONSTRAINT "saves_ratingsId_fkey";

-- AlterTable
ALTER TABLE "saves" ALTER COLUMN "ratingsId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "saves" ADD CONSTRAINT "saves_ratingsId_fkey" FOREIGN KEY ("ratingsId") REFERENCES "ratings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
