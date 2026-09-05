import multer from "multer";

// Use memory storage for quick streaming to AI/YOLO pipeline
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "application/octet-stream"];
  const isImageMime = allowedMimeTypes.includes(file.mimetype);
  const isImageExt = /\.(jpe?g|png|webp)$/i.test(file.originalname);

  if (isImageMime || isImageExt) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file format. Only JPEG, PNG, and WebP road images are supported."), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB maximum
  }
});
