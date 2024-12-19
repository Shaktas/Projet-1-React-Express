import bcrypt from "bcrypt";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import path from "path";
import { config } from "../Config/env.js";
import { createUser, getUserByEmail } from "../Repositories/userRepository.js";

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
      expiresIn: "1d",
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
   * Login user and generate token
   * @param {Object} user - User data from Login form
   * @param {string} password - Plain text password
   * @returns {Promise<Object>} Authentication result
   */
  async login(user) {
    try {
      const userDB = await getUserByEmail(user.UserEmail);

      const isValidPassword = await this.verifyPassword(
        user.UserPassword,
        userDB.UserPassword
      );

      if (!isValidPassword || !userDB) {
        throw new Error("Conexion failed");
      }

      const accessToken = this.generateAccessToken({
        id: userDB.UserId,
        email: userDB.UserEmail,
      });
      const refreshToken = this.generateRefreshToken({
        id: userDB.UserId,
        email: userDB.UserEmail,
      });

      return {
        success: true,
        message: "Successfully logged in",
        accessToken,
        refreshToken,
        user: {
          id: userDB.UserId,
          email: userDB.UserEmail,
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
        !userData.UserEmail ||
        !userData.UserPassword ||
        !userData.UserPseudo
      ) {
        throw new Error("Missing required fields");
      }

      const hashedPassword = await this.hashPassword(userData.UserPassword);

      const newUser = await createUser({
        data: {
          ...userData,
          UserPassword: hashedPassword,
        },
      });

      const accessToken = this.generateAccessToken({
        id: newUser.UserId,
        email: newUser.UserEmail,
      });

      const refreshToken = this.generateRefreshToken({
        id: newUser.UserId,
        email: newUser.UserEmail,
      });

      return {
        success: true,
        accessToken,
        refreshToken,
        user: {
          id: newUser.UserId,
          email: newUser.UserEmail,
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

  async RefreshToken(token) {
    try {
      const decoded = this.verifyRefreshToken(token);
      if (!decoded) {
        throw new Error("Unautorized access");
      }
      return {
        success: true,
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
