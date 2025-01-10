import bcrypt from "bcrypt";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import path from "path";
import { config } from "../Config/env.js";
import { createUser, getUserByEmail } from "../Repositories/userRepository.js";
import {
  createRefreshToken,
  updateRefreshTokenEnd,
} from "../Repositories/authRepository.js";
import encryptService from "../Services/encryptionService.js";

const algorithm = "RS256";

/**
 * Service handling authentication-related operations including user registration, login, and token management.
 * Implements the Singleton pattern to ensure only one instance exists.
 *
 * @class AuthService
 * @description Manages JWT-based authentication with access and refresh tokens, password hashing, and user session handling.
 *
 * @property {AuthService|null} instance - Singleton instance of the AuthService
 * @property {string|null} privateKey - Private key for signing JWT access tokens
 * @property {string|null} publicKey - Public key for verifying JWT access tokens
 * @property {string|null} refreshKey - Secret key for signing and verifying refresh tokens
 *
 * @throws {Error} When JWT keys fail to load during initialization
 *
 * @example
 * // Use authService to handle authentication operations
 * const loginResult = await authService.login(userData);
 */
class AuthService {
  static instance = null;
  #privateKey = null;
  #publicKey = null;
  #refreshKey = null;

  constructor() {
    if (AuthService.instance) {
      return AuthService.instance;
    }
    AuthService.instance = this;
    this.initializeKeys();
  }

  /**
   * Initialize JWT keys by reading them from the file system
   * @returns {Promise<void>}
   * @throws {Error} When the keys fail to load
   */
  async initializeKeys() {
    try {
      if (!this.#privateKey) {
        await this.loadPrivateKey();
      }
      if (!this.#publicKey) {
        await this.loadPublicKey();
      }
      if (!this.#refreshKey) {
        await this.loadRefreshKey();
      }
    } catch (error) {
      throw new Error(`Failed to load JWT keys: ${error.message}`);
    }
  }

  async loadPrivateKey() {
    this.#privateKey = await fs.readFile(
      path.resolve(config.jwt.private),
      "utf8"
    );
  }

  async loadPublicKey() {
    this.#publicKey = await fs.readFile(
      path.resolve(config.jwt.public),
      "utf8"
    );
  }

  async loadRefreshKey() {
    this.#refreshKey = await fs.readFile(
      path.resolve(config.jwt.refresh),
      "utf8"
    );
  }

  /**
   * Hash password before storing in database
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   */
  async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify password against hashed password
   * @param {string} password - Plain text password
   * @param {string} hashedPassword - Hashed password from database
   * @returns {Promise<boolean>}
   */
  async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Generates a JSON Web Token (JWT) access token
   * @param {Object} payload - The data to be encoded in the token
   * @returns {string} The signed JWT access token, valid for 10 minutes
   * @throws {Error} If token signing fails
   */
  generateAccessToken(payload) {
    return jwt.sign(payload, this.#privateKey, {
      algorithm: "RS256",
      expiresIn: "10m",
    });
  }

  /**
   * Generates a JSON Web Token (JWT) refresh token.
   * @param {Object} payload - The data to be encoded in the token.
   * @returns {string} A JWT refresh token signed with HS256 algorithm, valid for 60 minutes.
   */
  generateRefreshToken(payload) {
    return jwt.sign(payload, this.#refreshKey, {
      algorithm: "HS256",
      expiresIn: "60m",
    });
  }

  /**
   * Verify JWT acccess token
   * @param {string} token - JWT token to verify
   * @returns {Object|null} Decoded token payload or null if invalid
   */
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.#publicKey, { algorithms: ["RS256"] });
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify JWT refresh token
   * @param {string} token - JWT token to verify
   * @returns {Object|null} Decoded token payload or null if invalid
   */
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.#refreshKey, { algorithms: ["HS256"] });
    } catch (error) {
      return null;
    }
  }

  /**
   * Saves a refresh token in the database with an expiration date of 1 hours
   * @param {integer} id - The user ID
   * @param {string} refreshToken - The refresh token to be saved
   * @returns {Promise<Object>} The saved token object if successful, or an error object if failed
   * @throws {Error} When the token fails to save
   */
  async saveRefreshToken(id, refreshToken) {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    const expiresIn = date.toISOString();
    try {
      const saveToken = await createRefreshToken(id, refreshToken, expiresIn);
      if (!saveToken) {
        throw new Error("Failed to save refresh token");
      }
      return saveToken;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Login user and generate token
   * @param {Object} user - User data from Login form
   * @param {string} password - Plain text password
   * @returns {Promise<Object>} Authentication result
   */
  async login(user) {
    try {
      const userDB = await getUserByEmail(user.userEmail);

      const isValidPassword = await this.verifyPassword(
        user.userPassword,
        userDB.userPassword
      );

      if (!isValidPassword || !userDB) {
        throw new Error("Connection failed");
      }

      const accessToken = this.generateAccessToken({
        id: userDB.userId,
        email: userDB.userEmail,
      });

      if (!accessToken) {
        throw new Error("Failed to generate access token");
      }

      const refreshToken = this.generateRefreshToken({
        id: userDB.userId,
        email: userDB.userEmail,
      });

      if (!refreshToken) {
        throw new Error("Failed to generate refresh token");
      }

      const saveToken = await this.saveRefreshToken(
        userDB.userId,
        refreshToken
      );

      return {
        success: true,
        message: "Successfully logged in",
        accessToken,
        refreshToken,
        user: {
          id: userDB.userId,
          email: userDB.userEmail,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration result with token
   */
  async register(userData) {
    try {
      if (
        !userData.userEmail ||
        !userData.userPassword ||
        !userData.userPseudo
      ) {
        throw new Error("Missing required fields");
      }
      const hashedPassword = await this.hashPassword(userData.userPassword);

      const userObj = {
        ...userData,
        userPassword: hashedPassword,
      };

      const { encryptedData, encipher } = await encryptService.encrypt(
        userObj,
        "user",
        hashedPassword
      );

      const userDataEncrypted = {
        ...encryptedData,
        userEncrypted: encipher,
      };

      const newUser = await createUser(userDataEncrypted);

      const accessToken = this.generateAccessToken({
        id: newUser.userId,
        email: newUser.userEmail,
      });

      if (!accessToken) {
        throw new Error("Failed to generate access token");
      }

      const refreshToken = this.generateRefreshToken({
        id: newUser.userId,
        email: newUser.userEmail,
      });

      if (!refreshToken) {
        throw new Error("Failed to generate refresh token");
      }

      const saveToken = await this.saveRefreshToken(
        newUser.userId,
        refreshToken
      );

      return {
        success: true,
        accessToken,
        refreshToken,
        user: {
          id: newUser.userId,
          email: newUser.userEmail,
        },
        message: "Successfully registered",
      };
    } catch (error) {
      // Prisma error code for unique constraint violation
      if (error.code === "P2002") {
        return {
          success: false,
          message: "Email already exists",
        };
      }
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Logs out a user by revoking their refresh token
   * @param {string} id - The user ID
   * @param {string} token - The refresh token to revoke
   * @returns {Promise<Object>} Object containing success status and message
   * @throws {Error} If server error occurs during token revocation
   */
  async logout(id, token) {
    try {
      const date = new Date();
      const revoked = date.toISOString();
      const data = await updateRefreshTokenEnd(id, token, revoked);

      if (data === null || data === undefined) {
        throw new Error("Error server");
      }

      return {
        success: true,
        message: "Logout successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

const authService = new AuthService();
export default authService;
