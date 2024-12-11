/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Userid` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Posseder" DROP CONSTRAINT "Posseder_UserId_fkey";

-- DropForeignKey
ALTER TABLE "Vault" DROP CONSTRAINT "Vault_UserId_fkey";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "Userid",
ADD COLUMN     "UserId" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("UserId");

-- AddForeignKey
ALTER TABLE "Vault" ADD CONSTRAINT "Vault_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posseder" ADD CONSTRAINT "Posseder_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;
