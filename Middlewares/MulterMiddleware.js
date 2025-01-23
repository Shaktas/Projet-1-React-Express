import multer from "multer";
import fs from "fs/promises";
import path from "path";

async function deleteOldAvatar(userId) {
  const dir = `uploads/${userId}`;
  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      await fs.unlink(path.join(dir, file));
    }
  } catch (error) {
    console.error("Error deleting old avatar:", error);
  }
}

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dir = `uploads/${req.user.userId}`;
    try {
      await deleteOldAvatar(req.user.userId);
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-User-${req.user.userId}-${file.originalname}`),
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});
