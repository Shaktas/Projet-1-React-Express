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
async function getAllInfosUserById(id) {
  const getAllInfosUserById = await prisma.user.findUnique({
    where: { userId: parseInt(id) },
    include: {
      vault: {
        include: {
          card: true,
        },
      },
    },
  });
  return getAllInfosUserById;
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
  getAllInfosUserById,
  getUserById,
  getUserByEmail,
  getPwdUserbyId,
  getVaultsByUserId,
  createUser,
  updateUser,
  deleteUser,
};
