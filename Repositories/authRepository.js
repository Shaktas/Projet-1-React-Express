import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createSaveRefreshToken(userId, token, expireIn) {
  const saveToken = await prisma.refreshToken.create({
    data: {
      userId: userId,
      refreshToken: token,
      refreshExpiresAt: expireIn,
    },
  });
  return saveToken;
}
