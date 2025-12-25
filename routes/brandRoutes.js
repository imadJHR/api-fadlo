import express from "express";
import multer from "multer";
import {
  addBrand,
  editBrand,
  deleteBrand,
  getAllBrands,
} from "../controllers/brandController.js";

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  },
});

const upload = multer({ storage });

// ➕ CREATE
router.post("/", upload.single("image"), addBrand);

// ✏ UPDATE
router.put("/:id", upload.single("image"), editBrand);

// 🗑 DELETE
router.delete("/:id", deleteBrand);

// 📌 GET ALL
router.get("/", getAllBrands);

export default router;
