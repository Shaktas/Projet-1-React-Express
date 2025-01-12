import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getVaultById(vaultId) {
  const getVaultById = await prisma.vault.findUnique({
    where: { vaultId: parseInt(vaultId) },
  });
  return getVaultById;
}

async function getVaultCards(vaultId) {
  const getCardsByVaultId = await prisma.vault.findUnique({
    where: { vaultId: parseInt(vaultId) },
    include: { Card: true },
  });
  return getCardsByVaultId;
}

async function getVaultUsers(vaultId) {
  const getUsersByVaultId = await prisma.vault.findUnique({
    where: { vaultId: parseInt(vaultId) },
    include: { User: true },
  });
  return getUsersByVaultId;
}

async function getCardByVaultId(vaultId, cardId) {
  const getCardByVaultId = await prisma.vault.findUnique({
    where: { vaultId: parseInt(vaultId) },
    include: {
      Card: {
        where: {
          CardId: parseInt(cardId),
        },
      },
    },
  });
  return getCardByVaultId;
}

async function createVault(userId, vaultData) {
  const newVault = await prisma.vault.create({
    data: {
      ...vaultData,
      user: { connect: { userId: parseInt(userId) } },
    },
  });
  return newVault;
}

async function createCardInVault(vaultId, cardData) {
  const newCardVault = await prisma.card.create({
    data: {
      ...cardData,
      vault: {
        connect: { vaultId: parseInt(vaultId) },
      },
    },
  });

  return newCardVault;
}

async function updateVault(vaultId, vaultData) {
  const updatedVault = await prisma.vault.update({
    where: { vaultId: parseInt(vaultId) },
    data: vaultData,
  });
  return updatedVault;
}
async function updateCardInVault(vaultId, cardId, cardData) {
  const updatedVault = await prisma.vault.update({
    where: { vaultId: parseInt(vaultId) },
    include: {
      where: { cardId: parseInt(cardId) },
      Card: cardData,
    },
  });
  return updatedVault;
}

async function deleteCardInVault(vaultId, cardId) {
  const deletedVault = await prisma.vault.delete({
    where: { vaultId: parseInt(vaultId) },
    include: {
      where: { cardId: parseInt(cardId) },
    },
  });
  return deletedVault;
}

async function deleteVault(id) {
  const deletedVault = await prisma.vault.delete({
    where: { vaultId: parseInt(id) },
  });
  return deletedVault;
}

export {
  getVaultById,
  getVaultCards,
  getCardByVaultId,
  getVaultUsers,
  createVault,
  createCardInVault,
  updateVault,
  updateCardInVault,
  deleteVault,
  deleteCardInVault,
};
