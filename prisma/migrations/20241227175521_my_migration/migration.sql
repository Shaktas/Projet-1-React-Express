-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "userPseudo" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userPassword" TEXT NOT NULL,
    "userEncrypted" JSONB NOT NULL,
    "userCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Vault" (
    "vaultId" SERIAL NOT NULL,
    "vaultName" TEXT NOT NULL,
    "vaultCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vaultUpdatedAt" TIMESTAMP(3) NOT NULL,
    "vaultEncrypted" JSONB NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Vault_pkey" PRIMARY KEY ("vaultId")
);

-- CreateTable
CREATE TABLE "Card" (
    "cardId" SERIAL NOT NULL,
    "cardTitle" TEXT NOT NULL,
    "cardLogin" TEXT NOT NULL,
    "cardPassword" TEXT NOT NULL,
    "cardUrl" TEXT NOT NULL,
    "cardEncrypted" JSONB NOT NULL,
    "cardCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cardUpdatedAt" TIMESTAMP(3) NOT NULL,
    "vaultId" INTEGER NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("cardId")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "refreshId" SERIAL NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "refreshIssuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refreshExpiresAt" TIMESTAMP(3) NOT NULL,
    "refreshRevokedAt" TIMESTAMP(3),

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("refreshId")
);

-- CreateTable
CREATE TABLE "Posseder" (
    "vaultId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Posseder_pkey" PRIMARY KEY ("vaultId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userEmail_key" ON "User"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_refreshToken_key" ON "RefreshToken"("refreshToken");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- AddForeignKey
ALTER TABLE "Vault" ADD CONSTRAINT "Vault_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault"("vaultId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posseder" ADD CONSTRAINT "Posseder_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault"("vaultId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posseder" ADD CONSTRAINT "Posseder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
