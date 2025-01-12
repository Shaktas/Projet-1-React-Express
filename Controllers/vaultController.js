import encryption from "../Services/encryptionService.js";
import {
  getVaultById as getVaultByIdRepo,
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
  const vaultId = req.params.id;
  const userId = req.body.userId;
  try {
    const data = await getVaultByIdRepo(id);
    const decryptedData = await encryption.decrypt(data, vaultId, DB, userId);
    res.status(200).send({ success: true, data: decryptedData });
  } catch (error) {
    console.error("Error occurred during vault retrieval:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const getVaultUsers = async (req, res) => {
  const id = req.params.id;
  const decryptedResults = {};

  try {
    const data = await getVaultUsersRepo(id);
    const users = data.users;

    for (const user of users) {
      const userDeciphered = await encryption.decrypt(
        user,
        user.userId,
        DB,
        id
      );
      Object.assign(decryptedResults, userDeciphered);
    }

    res.status(200).send({ success: true, data: decryptedResults });
  } catch (error) {
    console.error("Error occurred during vault users retrieval:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const getVaultCards = async (req, res) => {
  const id = req.params.id;
  const decryptedResults = {};
  try {
    const cards = await getVaultCardsRepo(id);

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

export const getCardByVaultId = async (req, res) => {
  const vaultId = req.params.id;
  const cardId = req.params.cardId;
  try {
    const data = await getCardByVaultIdRepo(vaultId, cardId);
    const decryptedData = await encryption.decrypt(
      data,
      cardId,
      "card",
      cardId
    );
    res.status(200).send({ success: true, data: decryptedData });
  } catch (error) {
    console.error("Error occurred during card retrieval in vault:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const createVault = async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const { encryptedData, encipher } = await encryption.encrypt(data, DB);
    const vaultEncryptedData = {
      ...encryptedData,
      vaultEncrypted: encipher,
    };

    const vault = await createVaultRepo(userId, vaultEncryptedData);
    res.status(201).send({ success: true, data: encryptedData });
  } catch (error) {
    console.error("Error occurred during vault creation:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const createCardInVault = async (req, res) => {
  const vaultId = req.params.id;
  const data = req.body;

  try {
    const { encryptedData, encipher } = await encryption.encrypt(data, DB);

    const cardtEncryptedData = {
      ...encryptedData,
      cardEncrypted: encipher,
    };

    const card = await createCardInVaultRepo(vaultId, cardtEncryptedData);
    res.status(201).send({ success: true, data: encryptedData });
  } catch (error) {
    console.error("Error occurred during card creation in vault:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const updateVault = async (req, res) => {
  const vaultId = req.params.id;
  try {
    const { encryptedData, encipher } = await encryption.encrypt(req.body, DB);

    const vaultEncryptedData = {
      ...encryptedData,
      vaultEncrypted: encipher,
    };

    const updatedVault = await updateVaultRepo(vaultId, vaultEncryptedData);

    res.status(200).send({ success: true, data: encryptedData });
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
