import AuthService from "../Services/authService.js";

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
          id: decodedJwt.id,
          message: "Autorized access",
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
