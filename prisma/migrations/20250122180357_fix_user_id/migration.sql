/*
  Warnings:

  - You are about to drop the column `passwordResetUserId` on the `PasswordReset` table. All the data in the column will be lost.
  - Added the required column `userId` to the `PasswordReset` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PasswordReset" DROP CONSTRAINT "PasswordReset_passwordResetUserId_fkey";

-- AlterTable
ALTER TABLE "PasswordReset" DROP COLUMN "passwordResetUserId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PasswordReset" ADD CONSTRAINT "PasswordReset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
