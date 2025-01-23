import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
dotenv.config({ path: join(rootDir, ".env") });

const requiredEnvVars = [
  "DATABASE_URL",
  "RSA_PRIVATE_KEY_PATH",
  "RSA_PUBLIC_KEY_PATH",
  "SECRET_KEY_PATH",
  "REFRESH_KEY_PATH",
  "PORT",
  "NODE_ENV",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config = {
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    private: process.env.RSA_PRIVATE_KEY_PATH,
    public: process.env.RSA_PUBLIC_KEY_PATH,
    refresh: process.env.REFRESH_KEY_PATH,
    reset: process.env.RESET_KEY_PATH,
  },
  aes: {
    key: process.env.SECRET_KEY_PATH,
  },
  port: process.env.PORT,
  app: process.env.NODE_ENV,
  gmail: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  frontUrl: process.env.FRONT_URL,
};
