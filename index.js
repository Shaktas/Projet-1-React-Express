import express, { json } from "express";
import cors from "cors";
import { register } from "./Controllers/authController.js";
import authRoute from "./Routes/authRoute.js";
// import userRoute from "./Routes/userRoute.js";
// import vaultRoute from "./Routes/vaultRoute.js";
// import cardRoute from "./Routes/cardRoute.js";
import { config } from "./Config/env.js";
import cookieParser from "cookie-parser";
import { getAllUsers } from "./Repositories/userRepository.js";

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
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use("/", authRoute);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Serveur Express sur le port ${PORT}`);
});
