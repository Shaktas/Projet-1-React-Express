import express, { json } from "express";
import cors from "cors";
import { isAuthenticated } from "./Middlewares/authMiddleware.js";
import { uploadFile } from "./Middlewares/MulterMiddleware.js";
import authRouter from "./Routes/authRoute.js";
import { userRouter, usersRouter } from "./Routes/userRoute.js";
import vaultRouter from "./Routes/vaultRoute.js";
import { config } from "./Config/env.js";
import cookieParser from "cookie-parser";

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
app.post("/upload", isAuthenticated, uploadFile, (req, res) =>
  res.send(`Fichier téléchargé avec succès`)
);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Serveur Express sur le port ${PORT}`);
});
