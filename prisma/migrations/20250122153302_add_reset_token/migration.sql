-- CreateTable
CREATE TABLE "PasswordReset" (
    "passwordResetId" SERIAL NOT NULL,
    "passwordResetUserId" INTEGER NOT NULL,
    "passwordResetToken" TEXT NOT NULL,
    "passwordResetExpiresAt" TIMESTAMP(3) NOT NULL,
    "passwordResetCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "passwordResetUsed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("passwordResetId")
);

-- CreateIndex
CREATE INDEX "PasswordReset_passwordResetToken_idx" ON "PasswordReset"("passwordResetToken");

-- AddForeignKey
ALTER TABLE "PasswordReset" ADD CONSTRAINT "PasswordReset_passwordResetUserId_fkey" FOREIGN KEY ("passwordResetUserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
