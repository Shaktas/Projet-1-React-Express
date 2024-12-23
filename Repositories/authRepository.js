import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createRefreshToken(userId, token, expireIn) {
  const saveToken = await prisma.refreshToken.create({
    data: {
      userId: userId,
      refreshToken: token,
      refreshExpiresAt: expireIn,
    },
  });
  return saveToken;
}

export async function updateRefreshTokenEnd(userId, token, revoked) {
  const endToken = await prisma.refreshToken.update({
    where: { userId: userId, refreshToken: token },
    data: {
      refreshRevokedAt: revoked,
    },
  });
}
