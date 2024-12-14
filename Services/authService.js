import bcrypt from "bcrypt";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import path from "path";
import { config } from "../Config/env.js";
import { createUser } from "../Repositories/userRepository.js";

const jwtExpiresIn = "24h";
const algorithm = "RS256";

class AuthService {
  privateKey = null;
  publicKey = null;

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
   * Generate JWT token
   * @param {Object} payload - Data to encode in token
   * @returns {string} JWT token
   */
  generateToken(payload) {
    return jwt.sign(payload, this.privateKey, {
      algorithm: algorithm,
      expiresIn: jwtExpiresIn,
    });
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token to verify
   * @returns {Object|null} Decoded token payload or null if invalid
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, this.publicKey, { algorithms: [algorithm] });
    } catch (error) {
      return null;
    }
  }

  /**
   * Login user and generate token
   * @param {Object} user - User data from database
   * @param {string} password - Plain text password
   * @returns {Promise<Object>} Authentication result
   */
  async login(user, password) {
    try {
      const isValidPassword = await this.verifyPassword(
        password,
        user.UserPassword
      );

      if (!isValidPassword) {
        throw new Error("Invalid password");
      }

      const token = this.generateToken({
        id: user.UserId,
        email: user.UserEmail,
        pseudo: user.UserPseudo,
      });

      return {
        success: true,
        token,
        user: {
          id: user.UserId,
          email: user.UserEmail,
          pseudo: user.UserPseudo,
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

      const token = this.generateToken({
        id: newUser.UserId,
        email: newUser.UserEmail,
        pseudo: newUser.UserPseudo,
      });

      return {
        success: true,
        token,
        user: {
          id: newUser.UserId,
          email: newUser.UserEmail,
          pseudo: newUser.UserPseudo,
        },
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
}

export default new AuthService();
