// import { config } from "./env.js";
// // import AuthService from "../Services/authSercice.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

// const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
//   modulusLength: 2048,
//   publicKeyEncoding: {
//     type: "spki",
//     format: "pem",
//   },
//   privateKeyEncoding: {
//     type: "pkcs8",
//     format: "pem",
//   },
// });
// console.log(privateKey, publicKey);

// const refreshKey = crypto.randomBytes(64).toString("hex");
// console.log(refreshKey);

// const generateHash = async () => await bcrypt.hash("T1VK'9p!K9%VQ*`%", 10);
// generateHash().then((hash) => console.log(hash));

const date = new Date();
const isoDate = date.toISOString();
console.log(isoDate);
