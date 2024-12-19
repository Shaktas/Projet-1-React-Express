import { config } from "dotenv";
import authService from "../Services/authService.js";

export const register = async (req, res) => {
  const userData = {
    UserPseudo: req.body.pseudo,
    UserEmail: req.body.email,
    UserPassword: req.body.pwd,
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
          id: auth.user.id,
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
    UserEmail: req.body.email,
    UserPassword: req.body.pwd,
  };

  const auth = await authService.login(userData);

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
        id: auth.user.id,
        email: auth.user.email,
      },
    });
  } else {
    res.json(auth);
  }
};

export const refresh = async (req, res) => {
  const user = req.user;
  console.log(user);

  const token = authService.generateAccessToken({
    UserId: user.id,
    UserEmail: user.email,
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });

  res.send({ success: true });
};
