import authService from "../Services/authService.js";

export const register = async (req, res) => {
  const userData = {
    UserPseudo: req.body.pseudo,
    UserEmail: req.body.email,
    UserPassword: req.body.password,
  };
  const auth = await authService.register(userData);

  if (auth.success) {
    // Set HTTP-only cookie
    res.cookie("jwt", auth.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
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
    UserPassword: req.body.password,
  };

  const auth = authService.login(userData);

  if (auth.success) {
    // Set HTTP-only cookie
    res.cookie("jwt", auth.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
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
