/*
  Warnings:

  - You are about to drop the column `CPF` on the `profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "profiles_CPF_key";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "CPF",
ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "profiles_cpf_key" ON "profiles"("cpf");
