/*
  Warnings:

  - You are about to drop the column `time` on the `saves` table. All the data in the column will be lost.
  - Added the required column `description` to the `saves` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "saves" DROP COLUMN "time",
ADD COLUMN     "description" TEXT NOT NULL;
