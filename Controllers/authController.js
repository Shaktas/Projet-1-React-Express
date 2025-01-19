import { config } from "dotenv";
import authService from "../Services/authService.js";

export const register = async (req, res) => {
  const userData = {
    userPseudo: req.body.pseudo,
    userEmail: req.body.email,
    userPassword: req.body.pwd,
  };
  try {
    const auth = await authService.register(userData);

    if (auth.success) {
      // Set HTTP-only cookie
      res.cookie("jwt", auth.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 10 * 60 * 1000,
      });

      res.json({
        success: true,
        user: {
          userId: auth.user.id,
          email: auth.user.email,
        },
      });
    } else {
      res.json(auth);
    }
  } catch (error) {
    res.send(error.message);
  }
};

export const login = async (req, res) => {
  const userData = {
    userEmail: req.body.email,
    userPassword: req.body.pwd,
  };
  try {
    const auth = await authService.login(userData);

    console.log(auth);

    if (auth.success) {
      res.cookie("jwt", auth.accessToken, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 10 * 60 * 1000,
      });
      res.cookie("refresh", auth.refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });

      res.json({
        success: true,
        message: "Successfully logged in",
        user: {
          userId: auth.user.userId,
          userEmail: auth.user.userEmail,
        },
      });
    } else {
      throw new Error("Authentication failed");
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const refresh = async (req, res) => {
  try {
    const user = req.user;
    console.log(user);

    if (!user) {
      throw new Error("Unauthorized access");
    }

    const token = authService.generateAccessToken({
      userId: user.userId,
      userEmail: user.userEmail,
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 60 * 1000,
    });

    res.send({ success: true, userId: user.userId });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { jwt, refresh } = req.cookies;
    console.log(req.user);

    const userId = req.user.id;

    if (!refresh && !jwt) {
      throw new Error("Already Logout");
    }

    const clear = await authService.logout(userId, refresh);

    console.log(clear);

    if (!clear.success) {
      throw new Error("Logout failed");
    }

    res.clearCookie("jwt");
    res.clearCookie("refresh");

    res.json({
      success: true,
      message: "Successfully logged out",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
