/*
  Warnings:

  - The primary key for the `Card` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `CardCreatedAt` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `CardId` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `CardLogin` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `CardPassword` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `CardTitle` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `CardUpdatedAt` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `CardUrl` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `VaultId` on the `Card` table. All the data in the column will be lost.
  - The primary key for the `Posseder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserId` on the `Posseder` table. All the data in the column will be lost.
  - You are about to drop the column `VaultId` on the `Posseder` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserCreatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `UserEmail` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `UserId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `UserPassword` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `UserPseudo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `UserUpdatedAt` on the `User` table. All the data in the column will be lost.
  - The primary key for the `Vault` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserId` on the `Vault` table. All the data in the column will be lost.
  - You are about to drop the column `VaultCreatedAt` on the `Vault` table. All the data in the column will be lost.
  - You are about to drop the column `VaultId` on the `Vault` table. All the data in the column will be lost.
  - You are about to drop the column `VaultName` on the `Vault` table. All the data in the column will be lost.
  - You are about to drop the column `VaultUpdatedAt` on the `Vault` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userEmail]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cardLogin` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardPassword` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardTitle` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardUpdatedAt` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardUrl` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vaultId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Posseder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vaultId` to the `Posseder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userPassword` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userPseudo` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userUpdatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Vault` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vaultName` to the `Vault` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vaultUpdatedAt` to the `Vault` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_VaultId_fkey";

-- DropForeignKey
ALTER TABLE "Posseder" DROP CONSTRAINT "Posseder_UserId_fkey";

-- DropForeignKey
ALTER TABLE "Posseder" DROP CONSTRAINT "Posseder_VaultId_fkey";

-- DropForeignKey
ALTER TABLE "Vault" DROP CONSTRAINT "Vault_UserId_fkey";

-- DropIndex
DROP INDEX "User_UserEmail_key";

-- AlterTable
ALTER TABLE "Card" DROP CONSTRAINT "Card_pkey",
DROP COLUMN "CardCreatedAt",
DROP COLUMN "CardId",
DROP COLUMN "CardLogin",
DROP COLUMN "CardPassword",
DROP COLUMN "CardTitle",
DROP COLUMN "CardUpdatedAt",
DROP COLUMN "CardUrl",
DROP COLUMN "VaultId",
ADD COLUMN     "cardCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "cardId" SERIAL NOT NULL,
ADD COLUMN     "cardLogin" TEXT NOT NULL,
ADD COLUMN     "cardPassword" TEXT NOT NULL,
ADD COLUMN     "cardTitle" TEXT NOT NULL,
ADD COLUMN     "cardUpdatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "cardUrl" TEXT NOT NULL,
ADD COLUMN     "vaultId" INTEGER NOT NULL,
ADD CONSTRAINT "Card_pkey" PRIMARY KEY ("cardId");

-- AlterTable
ALTER TABLE "Posseder" DROP CONSTRAINT "Posseder_pkey",
DROP COLUMN "UserId",
DROP COLUMN "VaultId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD COLUMN     "vaultId" INTEGER NOT NULL,
ADD CONSTRAINT "Posseder_pkey" PRIMARY KEY ("vaultId", "userId");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "UserCreatedAt",
DROP COLUMN "UserEmail",
DROP COLUMN "UserId",
DROP COLUMN "UserPassword",
DROP COLUMN "UserPseudo",
DROP COLUMN "UserUpdatedAt",
ADD COLUMN     "userCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userEmail" TEXT NOT NULL,
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD COLUMN     "userPassword" TEXT NOT NULL,
ADD COLUMN     "userPseudo" TEXT NOT NULL,
ADD COLUMN     "userUpdatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "Vault" DROP CONSTRAINT "Vault_pkey",
DROP COLUMN "UserId",
DROP COLUMN "VaultCreatedAt",
DROP COLUMN "VaultId",
DROP COLUMN "VaultName",
DROP COLUMN "VaultUpdatedAt",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD COLUMN     "vaultCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "vaultId" SERIAL NOT NULL,
ADD COLUMN     "vaultName" TEXT NOT NULL,
ADD COLUMN     "vaultUpdatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Vault_pkey" PRIMARY KEY ("vaultId");

-- CreateTable
CREATE TABLE "RefreshToken" (
    "refreshId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "refreshIssuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refreshExpiresAt" TIMESTAMP(3) NOT NULL,
    "refreshRevokedAt" TIMESTAMP(3),

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("refreshId")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_refreshToken_key" ON "RefreshToken"("refreshToken");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_userEmail_key" ON "User"("userEmail");

-- AddForeignKey
ALTER TABLE "Vault" ADD CONSTRAINT "Vault_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault"("vaultId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posseder" ADD CONSTRAINT "Posseder_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault"("vaultId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posseder" ADD CONSTRAINT "Posseder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
