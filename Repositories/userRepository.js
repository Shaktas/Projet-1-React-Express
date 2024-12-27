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

async function getVaultsByUserId(id) {
  const getVaultsByUserId = await prisma.user.findUnique({
    where: { userId: parseInt(id) },
    include: { Vault: true },
  });
  return getVaultsByUserId;
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
  getVaultsByUserId,
  createUser,
  updateUser,
  deleteUser,
};
