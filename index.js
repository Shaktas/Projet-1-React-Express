import express from "express";
import authRoute from "./Routes/authRoute.js";
import userRoute from "./Routes/userRoute.js";
import vaultRoute from "./Routes/vaultRoute.js";
import cardRoute from "./Routes/cardRoute.js";
import { config } from "./Config/env.js";

const app = express();
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Serveur Express sur le port ${PORT}`);
});
