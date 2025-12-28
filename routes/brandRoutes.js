import express from "express";
import {
  addBrand,
  editBrand,
  deleteBrand,
  getAllBrands,
} from "../controllers/brandController.js";

import { uploadBrandCloudinary } from "../middleware/uploadBrandCloudinary.js";

const router = express.Router();

// ➕ CREATE
router.post("/", uploadBrandCloudinary, addBrand);

// ✏ UPDATE
router.put("/:id", uploadBrandCloudinary, editBrand);

// 🗑 DELETE
router.delete("/:id", deleteBrand);

// 📌 GET ALL
router.get("/", getAllBrands);

export default router;