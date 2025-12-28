import multer from "multer";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Format non supporté"), false);
};

const multerUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB, ajuste si besoin
}).single("image");

// Upload vers Cloudinary et expose le résultat
export const uploadBrandCloudinary = (req, res, next) => {
  multerUpload(req, res, async (err) => {
    if (err) return next(err);

    try {
      if (!req.file) {
        req.uploadedImage = null;
        return next();
      }

      const uploaded = await uploadBufferToCloudinary(req.file.buffer, {
        folder: "brands",
      });

      req.uploadedImage = {
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      };

      next();
    } catch (e) {
      next(e);
    }
  });
};