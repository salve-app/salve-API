/*
  Warnings:

  - You are about to drop the column `CEP` on the `addresses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `states` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cep` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "CEP",
ADD COLUMN     "cep" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "states_name_key" ON "states"("name");
