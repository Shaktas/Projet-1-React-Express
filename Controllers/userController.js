import { response } from "express";
import {
  getUserById,
  getAllUsers,
  deleteUser,
  getVaultsByUserId,
  getCardsByUserId,
  updateUser,
} from "../Repositories/userRepository.js";
import encryption from "../Services/encryptionService.js";

const DB = "user";

export const getOneUser = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await getUserById(id);
    let dataDeciphered = await encryption.decrypt(data, id, DB, "");
    dataDeciphered = { ...dataDeciphered, userEmail: data.userEmail };

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
      const dataDeciphered = await encryption.decrypt(
        data,
        data.userId,
        DB,
        ""
      );
      Object.assign(decryptedResults, { [data.userId]: dataDeciphered });
    }

    res.status(200).send({ success: true, data: decryptedResults });
  } catch (error) {
    console.error("Error occurred during user retrieval:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const getAllVaultsByUserId = async (req, res) => {
  const id = req.params.id;

  try {
    const decryptedResults = {};
    const datas = await getVaultsByUserId(id);
    const vaults = datas.vault;
    for (const vault of vaults) {
      const dataDeciphered = await encryption.decrypt(
        vault,
        vault.vaultId,
        "vault",
        id
      );
      Object.assign(decryptedResults, { [vault.vaultId]: dataDeciphered });
    }

    res.status(200).send({ success: true, data: decryptedResults });
  } catch (error) {
    console.error("Error occurred during user retrieval:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const getAllCardsByUserId = async (req, res) => {
  const id = req.params.id;

  try {
    const decryptedResults = {};
    const datas = await getCardsByUserId(id);
    const cards = datas.card;

    for (const data of datas) {
      const dataDeciphered = await encryption.decrypt(
        cards,
        cards.cardsId,
        "card",
        id
      );
      Object.assign(decryptedResults, { [cards.userId]: dataDeciphered });
    }

    res.status(200).send({ success: true, data: decryptedResults });
  } catch (error) {
    console.error("Error occurred during user retrieval:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const updateOneUser = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const email = data.email;
  const dataFormat = {
    userPseudo: data.pseudo,
    userId: id,
  };
  try {
    const { encryptedData, encipher } = await encryption.encrypt(
      dataFormat,
      DB
    );
    console.log(encryptedData, "encrypte", encipher, "encipher");

    const updateData = {
      ...encryptedData,
      userId: parseInt(id),
      userEncrypted: encipher,
      userEmail: email,
    };

    const update = await updateUser(id, updateData);
    res.status(200).send({ success: true, data: update });
  } catch (error) {
    console.error("Error occurred during user update:", error);
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
