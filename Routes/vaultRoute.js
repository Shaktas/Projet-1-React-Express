import express from "express";
import { isAuthenticated } from "../Middlewares/authMiddleware.js";
import {
  getVaultById,
  getVaultUsers,
  getVaultCards,
  createVault,
  createCardInVault,
  updateVault,
  updateCardInVault,
  deleteVault,
  deleteCardInVault,
} from "../Controllers/vaultController.js";

const vaultRouter = express.Router();

vaultRouter.get("/:id", isAuthenticated, getVaultById);
vaultRouter.get("/:id/users", isAuthenticated, getVaultUsers);
vaultRouter.get("/:id/cards", isAuthenticated, getVaultCards);
vaultRouter.get("/:id/card/:cardId", isAuthenticated, getVaultCards);
vaultRouter.post("/", isAuthenticated, createVault);
vaultRouter.post("/:id/card", isAuthenticated, createCardInVault);
vaultRouter.put("/:id", isAuthenticated, updateVault);
vaultRouter.put("/:id/card/:cardId", isAuthenticated, updateCardInVault);
vaultRouter.delete("/:id", isAuthenticated, deleteVault);
vaultRouter.delete("/:id/card/:cardId", isAuthenticated, deleteCardInVault);

export default vaultRouter;
