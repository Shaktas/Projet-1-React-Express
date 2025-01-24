import encryption from "../Services/encryptionService.js";
import {
  getVaultById as getVaultByIdRepo,
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
    res.status(200).json({ success: true, data: decryptedData });
  } catch (error) {
    console.error("Error occurred during vault retrieval:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVaultCards = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.userId;
  const decryptedResults = {};
  try {
    const cards = await getVaultCardsRepo(id);
    if (cards) {
      const { card } = cards;
      for (const c of card) {
        const cardDeciphered = await encryption.decrypt(
          c,
          c.cardId,
          "card",
          userId
        );
        Object.assign(decryptedResults, {
          [c.cardId]: cardDeciphered,
        });
      }
      res
        .status(200)
        .json({ success: true, data: decryptedResults, vaultId: id });
    } else {
      res
        .status(404)
        .json({ success: false, message: "No cards found in vault" });
    }
  } catch (error) {
    console.error("Error occurred during vault cards retrieval:", error);
    res.status(500).json({ success: false, message: error.message });
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
    res.status(200).json({ success: true, data: decryptedData });
  } catch (error) {
    console.error("Error occurred during card retrieval in vault:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createVault = async (req, res) => {
  const userId = req.user.userId;
  const data = req.body;
  const vaultPost = { vaultName: data.name, userId: userId };

  try {
    const { encryptedData, encipher } = await encryption.encrypt(vaultPost, DB);
    const vaultEncryptedData = {
      ...encryptedData,
      vaultEncrypted: encipher,
    };

    const vault = await createVaultRepo(userId, vaultEncryptedData);
    res.status(201).json({ success: true, data: encryptedData });
  } catch (error) {
    console.error("Error occurred during vault creation:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCardInVault = async (req, res) => {
  const vaultId = req.params.id;
  const cardPost = {
    cardTitle: req.body.name,
    cardLogin: req.body.username,
    cardPassword: req.body.password,
    cardUrl: req.body.url,
    cardType: req.body.type,
    userId: req.user.userId,
  };

  try {
    const { encryptedData, encipher } = await encryption.encrypt(cardPost, DB);

    const cardtEncryptedData = {
      ...encryptedData,
      cardEncrypted: encipher,
    };

    const card = await createCardInVaultRepo(vaultId, cardtEncryptedData);
    res.status(201).json({ success: true, data: encryptedData });
  } catch (error) {
    console.error("Error occurred during card creation in vault:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVault = async (req, res) => {
  const vaultId = req.params.id;
  const data = req.body;
  data.userId = req.user.userId;
  try {
    const { encryptedData, encipher } = await encryption.encrypt(data, DB);

    const vaultEncryptedData = {
      ...encryptedData,
      vaultEncrypted: encipher,
    };

    const updatedVault = await updateVaultRepo(vaultId, vaultEncryptedData);

    res.status(200).json({ success: true, data: encryptedData });
  } catch (error) {
    console.error("Error occurred during vault update:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCardInVault = async (req, res) => {
  const vaultId = req.params.id;
  const cardId = req.params.cardId;
  const userId = req.user.userId;
  const data = {
    cardTitle: req.body.name,
    cardLogin: req.body.username,
    cardPassword: req.body.password,
    cardUrl: req.body.url,
    cardType: req.body.type,
    userId,
  };

  try {
    const { encryptedData, encipher } = await encryption.encrypt(data, "cards");

    const cardEncryptedData = {
      ...encryptedData,
      cardEncrypted: encipher,
    };

    const updatedCard = await updateCardInVaultRepo(
      vaultId,
      cardId,
      cardEncryptedData
    );
    res.status(200).json({ success: true, data: updatedCard });
  } catch (error) {
    console.error("Error occurred during card update in vault:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteVault = async (req, res) => {
  const id = req.params.id;
  try {
    await deleteVaultRepo(id);
    res
      .status(200)
      .json({ success: true, message: "Vault deleted successfully" });
  } catch (error) {
    console.error("Error occurred during vault deletion:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCardInVault = async (req, res) => {
  const vaultId = req.params.id;
  const cardId = req.params.cardId;

  try {
    await deleteCardInVaultRepo(vaultId, cardId);
    res
      .status(200)
      .json({ success: true, message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error occurred during card deletion in vault:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
