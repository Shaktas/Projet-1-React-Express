import crypto from "crypto";
import { config } from "./env.js";
import fs from "fs/promises";

const algorithm = "aes-256-gcm";
const secretKey = fs.readFileSync(config.aes.key, "utf8");

// A comprendre
function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();
  return { encrypted, iv: iv.toString("hex"), tag: authTag.toString("hex") };
}

function decrypt(encrypted, iv, tag) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(tag, "hex"));
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
