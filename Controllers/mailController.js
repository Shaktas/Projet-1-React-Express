import nodemailer from "nodemailer";
import { config } from "../Config/env.js";
import { getUserByEmail } from "../Repositories/userRepository.js";
import encryption from "../Services/encryptionService.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.gmail.user,
    pass: config.gmail.pass,
  },
  debug: true,
});

transporter.verify(function (error, success) {
  if (error) {
    console.error("SMTP error:", error);
  } else {
    console.log("SMTP server ready");
  }
});

const mailController = {
  sendMail: async (req, res) => {
    const userEmail = req.body.userEmail;

    let userPseudo;
    let userId;
    try {
      const user = await getUserByEmail(userEmail);

      if (!user) {
        return res.status(404).json({ message: "Email not found" });
      }

      const userDecripted = await encryption.decrypt(
        user,
        user.userId,
        "user",
        ""
      );

      userPseudo = userDecripted.userPseudo;
      userId = user.userId;
    } catch (error) {
      res.status(500).json({ error: "Failed to send email" });
    }

    const { token } = await encryption.generateResetToken(userId);

    if (req.body.action === "reset-password") {
      const html = mailController.createResetPasswordEmailHtml(
        token,
        userPseudo
      );
      const to = userEmail;
      const subject = "Password Reset Request";
      let text;
      try {
        if (!html) {
          text =
            "Click the link below to reset your password.\n\nReset Link: " +
            resetLink +
            "\n\nIf you didn't request this, please ignore this email.\nThis link will expire in 15 minutes.";
        }

        const mailOptions = {
          from: config.gmail.user,
          to: to,
          subject: subject,
          text: text,
          html: html,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully" });
      } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
      }
    }
  },
  createResetPasswordEmailHtml: (token, username) => {
    const resetLink = `${config.frontUrl}/reset-password/${token}`;

    return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>Hello ${username},</p>
                <p>You requested to reset your password. Click the button below to set a new password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">
                        Reset Password
                    </a>
                </div>
                <p>If you didn't request this, please ignore this email.</p>
                <p>This link will expire in 15 minutes.</p>
                <p>Best regards,<br>Your Application Team</p>
            </div>
        `;
  },
};

export default mailController;
