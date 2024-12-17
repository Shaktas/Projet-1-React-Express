import express from "express";
import { isAuthenticated } from "../Middlewares/authMiddleware.js";
import { getOneUser } from "../Controllers/userController.js";

const router = express.Router();

router.get("/:id", isAuthenticated, getOneUser);

// router.post("/register", );

// router.post("/login", login);

// router.post("/verify", isAuthenticated, (req, res) => {
//   res.send({ success: true });
// });
// export default router;
