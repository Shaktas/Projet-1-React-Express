import { response } from "express";
import encryption from "../Services/encryptionService.js";
import {
  getVaultById as getVaultByIdRepo,
  getAllVaults as getAllVaultsRepo,
  getVaultUsers as getVaultUsersRepo,
  getVaultCards as getVaultCardsRepo,
  createVault as createVaultRepo,
  createCardInVault as createCardInVaultRepo,
  updateVault as updateVaultRepo,
  updateCardInVault as updateCardInVaultRepo,
  deleteVault as deleteVaultRepo,
  deleteCardInVault as deleteCardInVaultRepo,
} from "../Repositories/vaultRepository.js";

const DB = "vault";

export const getVaultById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await getVaultByIdRepo(id);
    const decryptedData = await encryption.decrypt(data, id, DB);
    res.status(200).send({ success: true, data: decryptedData });
  } catch (error) {
    console.error("Error occurred during vault retrieval:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const getAllVaults = async (req, res) => {
  try {
    const datas = await getAllVaultsRepo();
    const decryptedResults = {};

    for (const data of datas) {
      const dataDeciphered = await encryption.decrypt(data, data.vaultId, DB);
      Object.assign(decryptedResults, { [data.vaultId]: dataDeciphered });
    }

    res.status(200).send({ success: true, data: decryptedResults });
  } catch (error) {
    console.error("Error occurred during vaults retrieval:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const getVaultUsers = async (req, res) => {
  const id = req.params.id;
  try {
    const users = await getVaultUsersRepo(id);
    res.status(200).send({ success: true, data: users });
  } catch (error) {
    console.error("Error occurred during vault users retrieval:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const getVaultCards = async (req, res) => {
  const id = req.params.id;
  try {
    const cards = await getVaultCardsRepo(id);
    const decryptedResults = {};

    for (const card of cards) {
      const cardDeciphered = await encryption.decrypt(card, card.cardId, DB);
      Object.assign(decryptedResults, { [card.cardId]: cardDeciphered });
    }

    res.status(200).send({ success: true, data: decryptedResults });
  } catch (error) {
    console.error("Error occurred during vault cards retrieval:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const createVault = async (req, res) => {
  const userId = { userId: req.body.userId };
  const data = req.body;
  try {
    const { encryptedData, encipher } = await encryption.encrypt(data, DB);
    const vaultEncryptedData = {
      ...encryptedData,
      vaultEncrypted: encipher,
      ...userId,
    };
    console.log(vaultEncryptedData);

    const vault = await createVaultRepo(vaultEncryptedData);
    res.status(201).send({ success: true, data: vault });
  } catch (error) {
    console.error("Error occurred during vault creation:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const createCardInVault = async (req, res) => {
  const vaultId = req.params.id;
  try {
    const encryptedData = await encryption.encrypt(req.body, DB);
    const card = await createCardInVaultRepo(vaultId, encryptedData);
    res.status(201).send({ success: true, data: card });
  } catch (error) {
    console.error("Error occurred during card creation in vault:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const updateVault = async (req, res) => {
  const id = req.params.id;
  try {
    const encryptedData = await encryption.encrypt(req.body, id, DB);
    const updatedVault = await updateVaultRepo(id, encryptedData);
    res.status(200).send({ success: true, data: updatedVault });
  } catch (error) {
    console.error("Error occurred during vault update:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const updateCardInVault = async (req, res) => {
  const vaultId = req.params.id;
  const cardId = req.params.cardId;
  try {
    const encryptedData = await encryption.encrypt(req.body, cardId, DB);
    const updatedCard = await updateCardInVaultRepo(
      vaultId,
      cardId,
      encryptedData
    );
    res.status(200).send({ success: true, data: updatedCard });
  } catch (error) {
    console.error("Error occurred during card update in vault:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const deleteVault = async (req, res) => {
  const id = req.params.id;
  try {
    await deleteVaultRepo(id);
    res
      .status(200)
      .send({ success: true, message: "Vault deleted successfully" });
  } catch (error) {
    console.error("Error occurred during vault deletion:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const deleteCardInVault = async (req, res) => {
  const vaultId = req.params.id;
  const cardId = req.params.cardId;
  try {
    await deleteCardInVaultRepo(vaultId, cardId);
    res
      .status(200)
      .send({ success: true, message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error occurred during card deletion in vault:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};
