import AuthService from "../Services/authService.js";

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication token required" });
  }

  const decoded = AuthService.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.user = decoded;
  next();
};

export const refreshToken = async (req, res) => {
  try {
    const { refresh } = req.cookies;
    const decoded = AuthService.verifyRefreshToken(refresh);

    if (!decoded) {
      throw new Error("Invalid or expired token");
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};
