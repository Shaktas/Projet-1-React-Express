import multer from "multer";

export function uploadFile(req, res) {
  const userId = req.user.userId;

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) =>
      cb(null, `${Date.now()}-User-${userId}-${file.originalname}`),
  });

  const upload = multer({
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
  }).single("file");
}
