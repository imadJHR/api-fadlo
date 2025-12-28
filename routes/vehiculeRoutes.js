import express from "express";
import {
  addVehicule,
  editVehicule,
  deleteVehicule,
  getAllVehicules,
  getVehiculeBySlug,
  getRelatedVehicules,
} from "../controllers/vehiculeController.js";

import { uploadVehicules } from "../middleware/uploadVehicules.js"
// adapte le chemin selon ton projet (middleware, config, etc.)

const router = express.Router();

// ➕ Ajouter
router.post("/", uploadVehicules, addVehicule);

// ✏ Modifier
router.put("/:id", uploadVehicules, editVehicule);

// 🗑 Supprimer
router.delete("/:id", deleteVehicule);

// 🔗 Related
router.get("/related/:slug", getRelatedVehicules);

// 📌 Tous
router.get("/", getAllVehicules);

// 📌 Par slug (toujours en dernier car route dynamique)
router.get("/:slug", getVehiculeBySlug);

export default router;