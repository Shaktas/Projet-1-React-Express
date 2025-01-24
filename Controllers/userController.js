import { response } from "express";
import {
  getUserById,
  getAllUsers,
  deleteUser,
  getAllInfosUserById,
  updateUser,
  getVaultsByUserId,
} from "../Repositories/userRepository.js";
import {
  updateCardInVault,
  updateVault as updatedVaultRepo,
} from "../Repositories/vaultRepository.js";
import encryption from "../Services/encryptionService.js";
import auth from "../Services/authService.js";
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

export const updateOneUserPassword = async (req, res) => {
  const userId = req.user.userId;

  const newPassword = req.body.password;
  let data = {};

  try {
    // Get all user data
    const data = await getAllInfosUserById(userId);

    // user data
    const userData = {
      userId: userId,
      userPseudo: data.userPseudo,
      userEncrypted: data.userEncrypted,
    };

    // vault data
    const vaultData = [];
    for (const vault of data.vault) {
      vaultData.push({
        ...vault,
      });
    }

    // card data
    const cardData = [];
    for (const vault of data.vault) {
      for (const card of vault.card) {
        cardData.push({
          ...card,
        });
      }
    }

    //decript user data
    let userDeciphered = await encryption.decrypt(userData, userId, DB, "");
    userDeciphered = { ...userDeciphered, userEmail: data.userEmail };

    //decript vault data
    let vaultDeciphered = [];
    for (const vault of vaultData) {
      delete vault.card;

      let decrypt = await encryption.decrypt(
        vault,
        vault.vaultId,
        "vault",
        userId
      );
      vaultDeciphered.push({ ...decrypt, vaultId: vault.vaultId });
    }

    //decript card data
    let cardDeciphered = [];
    for (const card of cardData) {
      let decrypt = await encryption.decrypt(card, card.cardId, "card", userId);
      cardDeciphered.push({
        ...decrypt,
        cardId: card.cardId,
        vaultId: card.vaultId,
      });
    }
    //hash password
    const hashedPassword = await auth.hashPassword(newPassword);

    //crypt user data
    const userUpdate = {
      userPseudo: userDeciphered.userPseudo,
    };

    const { encryptedData, encipher } = await encryption.encrypt(
      userUpdate,
      DB,
      hashedPassword
    );

    const updateData = {
      ...encryptedData,
      userId: parseInt(userId),
      userPassword: hashedPassword,
      userEncrypted: encipher,
      userEmail: userDeciphered.userEmail,
    };

    const updateUserEncrypt = await updateUser(userId, updateData);

    //crypt vault data

    for (const vault of vaultDeciphered) {
      const vaultId = vault.vaultId;
      delete vault.vaultId;

      const { encryptedData, encipher } = await encryption.encrypt(
        vault,
        "vault",
        hashedPassword
      );

      const vaultEncryptedData = {
        ...encryptedData,
        vaultEncrypted: encipher,
      };
      const updateVault = await updatedVaultRepo(vaultId, vaultEncryptedData);
    }

    //crypt card data

    for (const card of cardDeciphered) {
      const cardId = card.cardId;
      const vaultId = card.vaultId;

      delete card.cardId;
      delete card.vaultId;

      const { encryptedData, encipher } = await encryption.encrypt(
        card,
        "card",
        hashedPassword
      );

      const cardEncryptedData = {
        ...encryptedData,
        cardEncrypted: encipher,
      };

      const updateCard = await updateCardInVault(
        vaultId,
        cardId,
        cardEncryptedData
      );
    }

    res.status(200).send({ success: true, data: updateUser });
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
