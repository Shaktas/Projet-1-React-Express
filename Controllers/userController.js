import { response } from "express";
import {
  getUserById,
  getAllUsers,
  deleteUser,
} from "../Repositories/userRepository.js";
import encryption from "../Services/encryptionService.js";

const DB = "user";

export const getOneUser = async (req, res) => {
  const id = req.params.id;
  const dataDeciphered = "";
  try {
    const data = await getUserById(id);
    const dataDeciphered = await encryption.decrypt(data, id, DB);

    res.status(200).send({ success: true, data: dataDeciphered });
  } catch (error) {
    console.error("Error occurred during user retrieval:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const datas = await getAllUsers();
    const decryptedResults = {};

    for (const data of datas) {
      const dataDeciphered = await encryption.decrypt(data, data.userId, DB);
      Object.assign(decryptedResults, { [data.userId]: dataDeciphered });
    }

    res.status(200).send({ success: true, data: decryptedResults });
  } catch (error) {
    console.error("Error occurred during user retrieval:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const deleteOneUser = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await getUserById(id);
    await deleteUser(id);
    res.status(200).send({ success: true, data });
  } catch (error) {
    console.error("Error occurred during user deletion:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};
