import express, { json } from "express";
import cors from "cors";
import authRouter from "./Routes/authRoute.js";
import { userRouter, usersRouter } from "./Routes/userRoute.js";
import { vaultRouter, vaultsRouter } from "./Routes/vaultRoute.js";
// import vaultRoute from "./Routes/vaultRoute.js";
// import cardRoute from "./Routes/cardRoute.js";
import { config } from "./Config/env.js";
import cookieParser from "cookie-parser";
import { getAllUsers, getUserById } from "./Repositories/userRepository.js";

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
app.use("/vaults", vaultsRouter);
app.use("/vault", vaultRouter);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Serveur Express sur le port ${PORT}`);
});
