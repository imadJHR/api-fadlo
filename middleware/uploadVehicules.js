import multer from "multer";

// Filtrer extensions
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Format non supporté"), false);
};

export const uploadVehicules = multer({
  storage: multer.memoryStorage(),   // <= important pour Lambda
  fileFilter,
  limits: {
    files: 10,
    fileSize: 10 * 1024 * 1024, // optionnel: 10MB par image
  },
}).array("images", 10);