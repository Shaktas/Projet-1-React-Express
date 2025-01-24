import AuthService from "../Services/authService.js";
import encryption from "../Services/encryptionService.js";

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unautorized access" });
  }

  const decoded = AuthService.verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Unautorized access" });
  }

  req.user = decoded;
  next();
};

export const refreshToken = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decodedJwt = AuthService.verifyAccessToken(req.cookies.jwt);

      if (decodedJwt) {
        res.status(200).json({
          success: true,
          userId: decodedJwt.userId,
          message: "Autorized access trololo",
        });
      }
    } else {
      const { refresh } = req.cookies;
      const decoded = AuthService.verifyRefreshToken(refresh);

      req.user = decoded;
      next();
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const isResetToken = async (req, res, next) => {
  const token = req.body.token;
  try {
    const decoded = await encryption.verifyResetToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Unautorized access" });
    }
    req.user = decoded;
  } catch (error) {
    res.status(401).json({ message: error.message });
  }

  next();
};
