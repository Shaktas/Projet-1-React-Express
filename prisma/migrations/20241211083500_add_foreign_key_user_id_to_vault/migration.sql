/*
  Warnings:

  - Added the required column `UserId` to the `Vault` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_UserPseudo_key";

-- AlterTable
ALTER TABLE "Vault" ADD COLUMN     "UserId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Vault" ADD CONSTRAINT "Vault_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Userid") ON DELETE RESTRICT ON UPDATE CASCADE;
