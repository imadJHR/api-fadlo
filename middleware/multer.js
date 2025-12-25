import multer from "multer";
import fs from "fs";
import path from "path";

// 📁 Dossier d’upload
const uploadDir = path.join("uploads", "vehicules");

// 📌 Vérifier que le dossier existe sinon le créer
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Dossier créé :", uploadDir);
}

// ⚙️ Configuration Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

// Filtrer extensions
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Format non supporté"), false);
};

export const uploadVehicules = multer({
  storage,
  fileFilter,
}).array("images", 10);
