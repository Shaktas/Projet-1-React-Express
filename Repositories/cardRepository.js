import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getAllCards() {
  const cards = await prisma.card.findMany();
  return cards;
}

async function getCardById(id) {
  const card = await prisma.card.findUnique({
    where: { CardId: parseInt(id) },
  });
  return card;
}

async function createCard(vaultId, cardData) {
  const newCard = await prisma.card.create({
    data: {
      ...cardData,
      VaultId: parseInt(vaultId),
    },
  });
  return newCard;
}

async function updateCard(cardId, cardData) {
  const updatedCard = await prisma.card.update({
    where: { CardId: parseInt(cardId) },
    data: cardData,
  });
  return updatedCard;
}

async function deleteCard(id) {
  const deletedCard = await prisma.card.delete({
    where: { CardId: parseInt(id) },
  });
  return deletedCard;
}

export { getAllCards, getCardById, createCard, updateCard, deleteCard };
