import {
  register,
  login,
  refresh,
  logout,
} from "../Controllers/authController.js";
import express from "express";
import {
  isAuthenticated,
  refreshToken,
} from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", isAuthenticated, logout);

router.post("/verify", isAuthenticated, (req, res) => {
  res.send({ success: true });
});

router.post("/refresh", refreshToken, refresh);

export default router;
