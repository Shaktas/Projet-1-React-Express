import authService from "../Services/authService.js";

export const register = async (req, res) => {
  const userData = {
    UserPseudo: req.body.pseudo,
    UserEmail: req.body.email,
    UserPassword: req.body.pwd,
  };
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
};

export const login = async (req, res) => {
  const userData = {
    UserEmail: req.body.email,
    UserPassword: req.body.pwd,
  };

  const auth = await authService.login(userData);
  console.log(auth);

  if (auth.success) {
    // Set HTTP-only cookie
    res.cookie("jwt", auth.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 60 * 1000,
    });
    res.cookie("refresh", auth.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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

export const Refresh = async (req, res) => {
  const user = req.user;

  const token = authService.generateToken({
    UserId: user.UserId,
    UserEmail: user.UserEmail,
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 10 * 60 * 1000,
  });
};
