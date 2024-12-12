import { config } from "./env.js";
// import AuthService from "../Services/authSercice.js";
import crypto from "crypto";
console.log(config.port);

const key = crypto.randomBytes(32).toString("hex");

console.log(key);
