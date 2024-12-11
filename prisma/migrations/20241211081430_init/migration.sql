/*
  Warnings:

  - The primary key for the `Card` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `login` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Card` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pseudo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - The primary key for the `Vault` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Vault` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Vault` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Vault` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Vault` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[UserPseudo]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[UserEmail]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `CardLogin` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CardPassword` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CardTitle` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CardUpdatedAt` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CardUrl` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `VaultId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserEmail` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserPassword` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserPseudo` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserUpdatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `VaultName` to the `Vault` table without a default value. This is not possible if the table is not empty.
  - Added the required column `VaultUpdatedAt` to the `Vault` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Card_login_key";

-- DropIndex
DROP INDEX "Card_title_key";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_pseudo_key";

-- AlterTable
ALTER TABLE "Card" DROP CONSTRAINT "Card_pkey",
DROP COLUMN "id",
DROP COLUMN "login",
DROP COLUMN "password",
DROP COLUMN "title",
DROP COLUMN "url",
ADD COLUMN     "CardCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "CardId" SERIAL NOT NULL,
ADD COLUMN     "CardLogin" TEXT NOT NULL,
ADD COLUMN     "CardPassword" TEXT NOT NULL,
ADD COLUMN     "CardTitle" TEXT NOT NULL,
ADD COLUMN     "CardUpdatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "CardUrl" TEXT NOT NULL,
ADD COLUMN     "VaultId" INTEGER NOT NULL,
ADD CONSTRAINT "Card_pkey" PRIMARY KEY ("CardId");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "id",
DROP COLUMN "password",
DROP COLUMN "pseudo",
DROP COLUMN "updatedAt",
ADD COLUMN     "UserCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "UserEmail" TEXT NOT NULL,
ADD COLUMN     "UserPassword" TEXT NOT NULL,
ADD COLUMN     "UserPseudo" TEXT NOT NULL,
ADD COLUMN     "UserUpdatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "Userid" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("Userid");

-- AlterTable
ALTER TABLE "Vault" DROP CONSTRAINT "Vault_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
ADD COLUMN     "VaultCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "VaultId" SERIAL NOT NULL,
ADD COLUMN     "VaultName" TEXT NOT NULL,
ADD COLUMN     "VaultUpdatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Vault_pkey" PRIMARY KEY ("VaultId");

-- CreateTable
CREATE TABLE "Posseder" (
    "VaultId" INTEGER NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "Posseder_pkey" PRIMARY KEY ("VaultId","UserId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_UserPseudo_key" ON "User"("UserPseudo");

-- CreateIndex
CREATE UNIQUE INDEX "User_UserEmail_key" ON "User"("UserEmail");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_VaultId_fkey" FOREIGN KEY ("VaultId") REFERENCES "Vault"("VaultId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posseder" ADD CONSTRAINT "Posseder_VaultId_fkey" FOREIGN KEY ("VaultId") REFERENCES "Vault"("VaultId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posseder" ADD CONSTRAINT "Posseder_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Userid") ON DELETE RESTRICT ON UPDATE CASCADE;
