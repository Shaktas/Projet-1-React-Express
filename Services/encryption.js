import crypto from "crypto";

const algorithm = "aes-256-gcm";
const secretKey = crypto.randomBytes(32);
const jwtSecret = crypto.randomBytes(32);

// A comprendre
function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
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

function generateToken(payload) {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  ).toString("base64");
  const content = Buffer.from(JSON.stringify(payload)).toString("base64");
  const signature = crypto
    .createHmac("sha256", jwtSecret)
    .update(`${header}.${content}`)
    .digest("base64");
  return `${header}.${content}.${signature}`;
}

export { encrypt, decrypt, generateToken };
