import crypto from "crypto";
import { config } from "../Config/env.js";
import { getEncryptedData } from "../Repositories/encryptionRepository.js";
import { getPwdUserbyId } from "../Repositories/userRepository.js";
import fs from "fs/promises";
import {
  getResetToken,
  saveResetToken,
} from "../Repositories/authRepository.js";

/**
 * Service for handling encryption and decryption operations using AES-256-GCM.
 * @class
 * @description Provides methods for encrypting and decrypting data using AES-256-GCM with salt and initialization vectors.
 * The service uses a combination of a secret key and optional user password for enhanced security.
 * @property {number} IV_LENGTH - The length of the initialization vector used in encryption (12 bytes)
 * @property {string} #secretKey - Private property storing the secret key loaded from configuration
 */
class EncryptionService {
  static IV_LENGTH = 12;
  #secretKey = null;

  constructor() {
    this.loadSecretKey();
  }

  async loadSecretKey() {
    if (!this.#secretKey) {
      this.#secretKey = await fs.readFile(config.aes.key, "utf8");
    }
  }

  /**
   * Generates a random salt using crypto.randomBytes
   * @returns {string} A 32-character hexadecimal string representing a 16-byte random salt
   */
  randomSalt() {
    return crypto.randomBytes(16).toString("hex");
  }

  /**
   * Encrypts text using AES-256-GCM encryption with a derived key.
   * @async
   * @param {object} texts - The object of texts to encrypt
   * @param {string|number} id - The identifier associated with the encryption
   * @param {object} db - The database instance
   * @param {string} [userPassword=""] - user password to strengthen encryption
   * @returns {Promise<{
   *   encryptedData: string,
   *   iv: string,
   *   tag: string,
   *   salt: string
   * }|null>} Object containing encrypted data and associated parameters, or null if encryption fails
   * @throws {Error} If encryption process fails
   */
  async encrypt(texts, DB, userPassword = false) {
    if (userPassword === false) {
      userPassword = await getPwdUserbyId(texts.userId);
      delete texts.userId;
    }

    try {
      const randomSalt = this.randomSalt();

      const combinedKey = crypto.pbkdf2Sync(
        this.#secretKey + userPassword,
        randomSalt,
        100000,
        32,
        "sha256"
      );

      const iv = crypto.randomBytes(EncryptionService.IV_LENGTH);

      const cipher = crypto.createCipheriv("aes-256-gcm", combinedKey, iv);

      // Créer un objet pour stocker les textes cryptés et leurs authTags
      const encryptedTexts = {};
      const authTags = {};

      // Chiffrer chaque texte avec les mêmes paramètres
      for (const [key, value] of Object.entries(texts)) {
        if (key === "userPassword") {
          continue;
        }
        const cipher = crypto.createCipheriv("aes-256-gcm", combinedKey, iv);
        let encrypted = cipher.update(value.toString(), "utf8", "hex");
        encrypted += cipher.final("hex");
        authTags[key] = cipher.getAuthTag().toString("hex");

        encryptedTexts[key] = encrypted;
      }

      if (DB === "user") {
        encryptedTexts.userPassword = userPassword;
      }

      return {
        encryptedData: encryptedTexts,
        encipher: {
          iv: iv.toString("hex"),
          tags: authTags,
          salt: randomSalt,
        },
      };
    } catch (error) {
      console.error("Error occurred during encryption:", error);
      return null;
    }
  }

  /**
   * Decrypts data using AES-256-GCM algorithm
   * @async
   * @param {objet} encrypted - The encrypted datas in hexadecimal format
   * @param {string} id - The identifier used to retrieve encryption metadata
   * @param {string} db - Database connection name
   * @param {string} [userPassword=""] - Optional user password for additional encryption layer
   * @returns {Promise<string>} The decrypted data in UTF-8 format
   * @throws {Error} If decryption fails or required metadata is missing
   */
  async decrypt(encrypted, id, db, userId) {
    if (db === "user") {
      userId = id;
    }

    let userPassword = await getPwdUserbyId(userId);

    const data = await getEncryptedData(db, id);

    const { iv, tags, salt } = data[db + "Encrypted"];
    let decryptedObj = {};

    const combinedKey = crypto.pbkdf2Sync(
      this.#secretKey + userPassword,
      salt,
      100000,
      32,
      "sha256"
    );

    for (const [keyTags, tag] of Object.entries(tags)) {
      for (const [keyEncrypted, value] of Object.entries(encrypted)) {
        if (keyTags !== keyEncrypted) {
          continue;
        }

        const decipher = crypto.createDecipheriv(
          "aes-256-gcm",
          combinedKey,
          Buffer.from(iv, "hex")
        );
        decipher.setAuthTag(Buffer.from(tag, "hex"));
        let decrypted = decipher.update(value, "hex", "utf8");
        decrypted += decipher.final("utf8");
        Object.assign(decryptedObj, { [keyEncrypted]: decrypted });
      }
    }
    return decryptedObj;
  }

  async generateResetToken(userId) {
    // Use crypto for one-time reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token for storage
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Short expiry for security
    const expiresIn = 120 * 60 * 1000; // 15 minutes
    const expiresAt = new Date(Date.now() + expiresIn);
    const saveToken = await saveResetToken(userId, hashedToken, expiresAt);

    if (!saveToken) {
      throw new Error("Failed to save reset token");
    }

    return {
      token: resetToken,
    };
  }

  async verifyResetToken(token) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    try {
      const resetToken = await getResetToken(hashedToken);
      if (!resetToken) {
        throw new Error("Token not found");
      }

      if (resetToken.passwordResetExpiresAt < Date.now()) {
        throw new Error("Token expired");
      }

      return resetToken;
    } catch (error) {
      console.error("Error occurred during reset token verification:", error);
      return null;
    }
  }
}

export default new EncryptionService();
