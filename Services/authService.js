import bcrypt from "bcrypt";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import path from "path";
import { config } from "../Config/env.js";
import { createUser, getUserByEmail } from "../Repositories/userRepository.js";
import { createSaveRefreshToken } from "../Repositories/authRepository.js";

const algorithm = "RS256";

class AuthService {
  privateKey = null;
  publicKey = null;
  refreshKey = null;

  constructor() {
    this.initializeKeys();
  }

  async initializeKeys() {
    try {
      this.privateKey = await fs.readFile(
        path.resolve(config.jwt.private),
        "utf8"
      );
      this.publicKey = await fs.readFile(
        path.resolve(config.jwt.public),
        "utf8"
      );
      this.refreshKey = await fs.readFile(
        path.resolve(config.jwt.refresh),
        "utf8"
      );
    } catch (error) {
      throw new Error("Failed to load JWT keys");
    }
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
   * Generate JWT access token
   * @param {Object} payload - Data to encode in token
   * @returns {string} JWT access token
   */
  generateAccessToken(payload) {
    return jwt.sign(payload, this.privateKey, {
      algorithm: "RS256",
      expiresIn: "10m",
    });
  }

  /**
   * Generate JWT refresh token
   * @param {Object} payload - Data to encode in token
   * @returns {string} JWT refresh token
   */
  generateRefreshToken(payload) {
    return jwt.sign(payload, this.refreshKey, {
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
      return jwt.verify(token, this.publicKey, { algorithms: ["RS256"] });
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
      return jwt.verify(token, this.refreshKey, { algorithms: ["HS256"] });
    } catch (error) {
      return null;
    }
  }

  /**
   * Saves a refresh token in the database with an expiration date of 6 hours
   * @param {integer} id - The user ID
   * @param {string} refreshToken - The refresh token to be saved
   * @returns {Promise<Object>} The saved token object if successful, or an error object if failed
   * @throws {Error} When the token fails to save
   */
  async saveRefreshToken(id, refreshToken) {
    const date = new Date();
    date.setHours(date.getHours() + 6);
    const expiresIn = date.toISOString();
    try {
      const saveToken = await createSaveRefreshToken(
        id,
        refreshToken,
        expiresIn
      );
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
        throw new Error("Conexion failed");
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

      console.log(saveToken);

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

      const hashedPassword = await this.hashPassword(userData.UserPassword);

      const newUser = await createUser({
        data: {
          ...userData,
          userPassword: hashedPassword,
        },
      });

      const accessToken = this.generateAccessToken({
        id: newUser.userId,
        email: newUser.userEmail,
      });

      const refreshToken = this.generateRefreshToken({
        id: newUser.userId,
        email: newUser.userEmail,
      });

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
   * Refreshes an authentication token by verifying and decoding it
   * @param {string} token - The refresh token to verify
   * @returns {Promise<{success: boolean, id?: string, message?: string}>} Object containing success status and either user id or error message
   * @throws {Error} When token verification fails or access is unauthorized
   */
  async RefreshToken(token) {
    try {
      const decoded = this.verifyRefreshToken(token);
      if (!decoded) {
        throw new Error("Unautorized access");
      }
      return {
        success: true,
        id: decoded.id,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

export default new AuthService();
