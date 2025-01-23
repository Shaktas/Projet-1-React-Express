import { avatarService } from "../services/avatarService.js";

export default async function avatarController(req, res) {
  try {
    const avatar = await avatarService.getAvatarForUser(req.user.userId);

    if (!avatar) {
      return res.status(404).json({
        success: false,
        message: "No avatar found",
      });
    }

    res.setHeader("Content-Type", avatar.contentType);
    res.send(avatar.buffer);
  } catch (error) {
    console.error("Error in avatar controller:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving avatar",
    });
  }
}
