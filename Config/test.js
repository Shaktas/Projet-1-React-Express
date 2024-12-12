import { config } from "./env.js";
import AuthService from "../Services/authSercice.js";
import crypto from "crypto";

const key = crypto.randomBytes(32).toString("hex");

console.log(key);
