import { register, login } from "../Controllers/authController.js";
import express from "express";
import { isAuthenticated } from "../Middlewares/authMiddleware.js";
import { getAllUsers } from "../Repositories/userRepository.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/test", isAuthenticated, getAllUsers);
export default router;
