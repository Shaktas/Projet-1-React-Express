import express, { json } from "express";
import cors from "cors";
import { isAuthenticated, isResetToken } from "./Middlewares/authMiddleware.js";
import { upload } from "./Middlewares/MulterMiddleware.js";
import authRouter from "./Routes/authRoute.js";
import { userRouter, usersRouter } from "./Routes/userRoute.js";
import vaultRouter from "./Routes/vaultRoute.js";
import { config } from "./Config/env.js";
import cookieParser from "cookie-parser";
import avatarController from "./Controllers/avatarController.js";
import mailController from "./Controllers/mailController.js";
import { updateOneUserPassword } from "./Controllers/userController.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/", authRouter);
app.use("/users", usersRouter);
app.use("/user", userRouter);
app.use("/vault", vaultRouter);
app.post("/upload", isAuthenticated, upload.single("avatar"), (req, res) =>
  res.send(`Fichier téléchargé avec succès`)
);
app.get("/avatar", isAuthenticated, avatarController);
app.post("/reset-password", mailController.sendMail);
app.put("/updatePassword", isResetToken, updateOneUserPassword);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Serveur Express sur le port ${PORT}`);
});
