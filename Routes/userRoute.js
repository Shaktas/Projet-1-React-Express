/**
 * Express router configuration for user-related endpoints
 * @module Routes/userRoute
 *
 * @requires express
 * @requires ../Middlewares/authMiddleware
 * @requires ../Controllers/userController
 *
 * @exports {object} usersRouter - Router handling multiple users endpoints
 * @exports {object} userRouter - Router handling single user endpoints
 *
 * Endpoints for usersRouter:
 * @route {GET} / - Get all users (requires authentication)
 *
 * Endpoints for userRouter:
 * @route {GET} /:id - Get a specific user by ID (requires authentication)
 * @route {GET} /:id/vaults - Get all vaults for a specific user (requires authentication)
 * @route {POST} /:id/cards - Get all cards for a specific user (requires authentication)
 * @route {PUT} /:id/ - Update a specific user (requires authentication)
 * @route {DELETE} /:id/ - Delete a specific user (requires authentication)
 */

import express from "express";
import { isAuthenticated } from "../Middlewares/authMiddleware.js";
import {
  getOneUser,
  getUsers,
  deleteOneUser,
  getAllVaultsByUserId,
  getAllCardsByUserId,
  // updateUser,
} from "../Controllers/userController.js";

const usersRouter = express.Router();
const userRouter = express.Router();

usersRouter.get("/", getUsers);
userRouter.get("/:id", getOneUser);
userRouter.get("/:id/vaults", getAllVaultsByUserId);
userRouter.post("/:id/cards", isAuthenticated, getAllCardsByUserId);
// userRouter.put("/:id/", isAuthenticated, updateUser);
userRouter.delete("/:id/", isAuthenticated, deleteOneUser);

export { usersRouter, userRouter };
