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
  return endToken;
}

export async function saveResetToken(userId, token, expireIn) {
  const saveToken = await prisma.passwordReset.create({
    data: {
      passwordResetToken: token,
      passwordResetExpiresAt: expireIn,
      user: {
        connect: {
          userId: userId,
        },
      },
    },
  });
  return saveToken;
}

export async function getResetToken(token) {
  const resetToken = await prisma.passwordReset.findFirst({
    where: { passwordResetToken: token },
  });
  return resetToken;
}
