import express from "express";
import multer from "multer";
import path from "path";
import {
  addVehicule,
  editVehicule,
  deleteVehicule,
  getAllVehicules,
  getVehiculeBySlug,
  getRelatedVehicules
} from "../controllers/vehiculeController.js";

const router = express.Router();

// 📁 Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/vehicules");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  },
});

const upload = multer({ storage });

// ➕ Ajouter
router.post("/", upload.array("images", 10), addVehicule);

// ✏ Modifier
router.put("/:id", upload.array("images", 10), editVehicule);

// 🗑 Supprimer
router.delete("/:id", deleteVehicule);
router.get("/related/:slug", getRelatedVehicules)


// 📌 Tous
router.get("/", getAllVehicules);

// 📌 Par slug
router.get("/:slug", getVehiculeBySlug);

export default router;
