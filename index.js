import express, { json } from "express";
import cors from "cors";
import { register } from "./Controllers/authController.js";
import authRoute from "./Routes/authRoute.js";
// import userRoute from "./Routes/userRoute.js";
// import vaultRoute from "./Routes/vaultRoute.js";
// import cardRoute from "./Routes/cardRoute.js";
import { config } from "./Config/env.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "https://localhost:3000",
    credentials: true,
  })
);

app.use("/", authRoute);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Serveur Express sur le port ${PORT}`);
});
