import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getAllVaults() {
  const getAllVaults = await prisma.vault.findMany();
  return getAllVaults;
}

async function getVaultById(vaultId) {
  const getVaultById = await prisma.vault.findUnique({
    where: { VaultId: parseInt(vaultId) },
  });
  return getVaultById;
}

async function getCardsByVaultId(vaultId) {
  const getCardsByVaultId = await prisma.vault.findUnique({
    where: { VaultId: parseInt(vaultId) },
    include: { Card: true },
  });
  return getCardsByVaultId;
}

async function getCardByVaultId(vaultId, cardId) {
  const getCardByVaultId = await prisma.vault.findUnique({
    where: { VaultId: parseInt(vaultId) },
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

async function createVault(vaultData) {
  const newVault = await prisma.vault.create({
    data: vaultData,
  });
  return newVault;
}

async function createCardByVaultId(vaultId, cardData) {
  const newCardVault = await prisma.vault.create({
    where: { VaultId: parseInt(vaultId) },
    include: {
      Card: cardData,
    },
  });
  return newCardVault;
}

async function updateVault(vaultId, vaultData) {
  const updatedVault = await prisma.vault.update({
    where: { VaultId: parseInt(vaultId) },
    data: vaultData,
  });
  return updatedVault;
}
async function updateCardByVaultId(vaultId, cardId, cardData) {
  const updatedVault = await prisma.vault.update({
    where: { VaultId: parseInt(vaultId) },
    include: {
      where: { CardId: parseInt(cardId) },
      Card: cardData,
    },
  });
  return updatedVault;
}

async function deleteCardByVaultId(vaultId, cardId) {
  const deletedVault = await prisma.vault.delete({
    where: { VaultId: parseInt(vaultId) },
    include: {
      where: { CardId: parseInt(cardId) },
    },
  });
  return deletedVault;
}

async function deleteVault(id) {
  const deletedVault = await prisma.vault.delete({
    where: { VaultId: parseInt(id) },
  });
  return deletedVault;
}

export {
  getAllVaults,
  getVaultById,
  getCardsByVaultId,
  createVault,
  createCardByVaultId,
  updateVault,
  updateCardByVaultId,
  deleteVault,
  deleteCardByVaultId,
};
