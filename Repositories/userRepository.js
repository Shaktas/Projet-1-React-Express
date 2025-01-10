import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getAllUsers() {
  const getAllUsers = await prisma.user.findMany();
  return getAllUsers;
}
async function getUserById(id) {
  const getUserById = await prisma.user.findUnique({
    where: { userId: parseInt(id) },
  });
  return getUserById;
}

async function getUserByEmail(email) {
  const getUserByEmail = await prisma.user.findUnique({
    where: { userEmail: email },
  });
  return getUserByEmail;
}

async function getPwdUserbyId(id) {
  const getPwdUserbyId = await prisma.user.findUnique({
    where: { userId: parseInt(id) },
    select: { userPassword: true },
  });
  return getPwdUserbyId.userPassword;
}

async function getVaultsByUserId(id) {
  const getVaultsByUserId = await prisma.user.findUnique({
    where: { userId: parseInt(id) },
    include: { vault: true },
  });
  return getVaultsByUserId;
}

async function getCardsByUserId(id) {
  const getCardsByUserId = await prisma.user.findUnique({
    where: { userId: parseInt(id) },
    include: { Card: true },
  });
  return getCardsByUserId;
}

async function createUser(userData) {
  const newUser = await prisma.user.create({ data: { ...userData } });
  return newUser;
}

async function updateUser(id, userData) {
  const updatedUser = await prisma.user.update({
    where: { userId: parseInt(id) },
    data: userData,
  });
  return updatedUser;
}

async function deleteUser(id) {
  const deletedUser = await prisma.user.delete({
    where: { userId: parseInt(id) },
  });
  return deletedUser;
}

export {
  getAllUsers,
  getUserById,
  getUserByEmail,
  getPwdUserbyId,
  getVaultsByUserId,
  getCardsByUserId,
  createUser,
  updateUser,
  deleteUser,
};
