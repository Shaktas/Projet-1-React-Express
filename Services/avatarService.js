import fs from "fs/promises";
import path from "path";

export const avatarService = {
  async getAvatarForUser(userId) {
    const dir = `uploads/${userId}`;
    const avatarFiles = await fs.readdir(dir);

    if (avatarFiles.length === 0) {
      return null;
    }

    const avatarPath = path.join(dir, avatarFiles[0]);
    const ext = path.extname(avatarFiles[0]).toLowerCase();
    const contentType = ext === ".png" ? "image/png" : "image/jpeg";
    const avatarBuffer = await fs.readFile(avatarPath);

    return {
      buffer: avatarBuffer,
      contentType,
    };
  },
};
