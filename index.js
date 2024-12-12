import express, { json } from "express";
import AuthService from "./Services/authService.js";
// import userRoute from "./Routes/userRoute.js";
// import vaultRoute from "./Routes/vaultRoute.js";
// import cardRoute from "./Routes/cardRoute.js";
import { config } from "./Config/env.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Serveur Express sur le port ${PORT}`);
});

app.post("/register", async (req, res) => {
  try {
    const userData = {
      UserPseudo: req.body.pseudo,
      UserEmail: req.body.email,
      UserPassword: req.body.password,
    };
    const auth = await AuthService.register(userData);
    console.log(auth.message); // error secretOrPrivateKey must be an asymmetric key when using RS256
    if (!auth) {
      throw new Error("Registration failed");
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        email: auth.email,
        pseudo: auth.pseudo,
        token: auth.token,
      },
    });
  } catch (error) {
    console.log("3 catch");

    res.status(400).json(error);
  }
});
