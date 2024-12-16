// import { config } from "./env.js";
// // import AuthService from "../Services/authSercice.js";
// import crypto from "crypto";

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
const test = {
  name: "test",
  age: 25,
  blabla: "hello",
};

const { name, age, blabla } = test;

console.log(name, age, blabla);
