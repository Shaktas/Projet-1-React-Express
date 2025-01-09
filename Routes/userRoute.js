import express from "express";
import { isAuthenticated } from "../Middlewares/authMiddleware.js";
import {
  getOneUser,
  getUsers,
  deleteOneUser,
} from "../Controllers/userController.js";

const usersRouter = express.Router();
const userRouter = express.Router();

usersRouter.get("/", isAuthenticated, getUsers);
userRouter.get("/:id", isAuthenticated, getOneUser);
userRouter.get("/:id/vault", isAuthenticated);
userRouter.put("/:id/", isAuthenticated);
userRouter.delete("/:id/", deleteOneUser);

export { usersRouter, userRouter };
