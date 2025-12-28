import Vehicule from "../models/vehiculeModel.js";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";

/**
 * Helpers: parse types coming from multipart/form-data (strings)
 */
const toBool = (v) => {
  if (v === undefined) return undefined;
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.toLowerCase() === "true";
  return undefined;
};

const toNumber = (v) => {
  if (v === undefined) return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
};

const parseJsonMaybe = (v) => {
  if (v === undefined) return undefined;
  if (typeof v !== "string") return v; // already object/array
  try {
    return JSON.parse(v);
  } catch {
    return v; // keep as string if not JSON
  }
};

// ➕ Ajouter un véhicule
export const addVehicule = async (req, res) => {
  try {
    const {
      nom,
      marque,
      type,
      description,
    } = req.body;

    // Convert types
    const prixParJour = toNumber(req.body.prixParJour);
    const vedette = toBool(req.body.vedette) ?? false;
    const disponible = toBool(req.body.disponible) ?? true;

    // specifications can be JSON string OR object (specifications[seats] style)
    const specifications = parseJsonMaybe(req.body.specifications);

    // Upload vers Cloudinary
    const files = req.files || [];
    const uploaded = await Promise.all(
      files.map((file) =>
        uploadBufferToCloudinary(file.buffer, { folder: "uploads/vehicules" })
      )
    );

    // schema: tableau de strings (URLs)
    const images = uploaded.map((r) => r.secure_url);

    const vehicule = new Vehicule({
      nom,
      marque,
      type,
      prixParJour,
      description,
      vedette,
      disponible,
      specifications,
      images,
    });

    await vehicule.save();
    res.json({ success: true, vehicule });
  } catch (error) {
    console.log("❌ ERROR ADD :", error);
    res.json({ success: false, message: error.message });
  }
};

// ✏️ Modifier un véhicule (images: garder existantes + ajouter nouvelles)
export const editVehicule = async (req, res) => {
  try {
    const { id } = req.params;

    // imagesExistantes: JSON string OR array
    let imagesExistantes = [];
    if (req.body.imagesExistantes) {
      imagesExistantes = Array.isArray(req.body.imagesExistantes)
        ? req.body.imagesExistantes
        : JSON.parse(req.body.imagesExistantes);
    }

    // Upload nouvelles images vers Cloudinary
    const files = req.files || [];
    const uploaded = await Promise.all(
      files.map((file) =>
        uploadBufferToCloudinary(file.buffer, { folder: "uploads/vehicules" })
      )
    );
    const newImages = uploaded.map((r) => r.secure_url);

    const imagesFinales = [...imagesExistantes, ...newImages];

    // Remove technical fields and normalize types
    const {
      imagesExistantes: _ignore,
      prixParJour: prixRaw,
      vedette: vedetteRaw,
      disponible: dispoRaw,
      specifications: specsRaw,
      ...restBody
    } = req.body;

    const update = {
      ...restBody,
      images: imagesFinales,
    };

    const prix = toNumber(prixRaw);
    if (prix !== undefined) update.prixParJour = prix;

    const ved = toBool(vedetteRaw);
    if (ved !== undefined) update.vedette = ved;

    const dispo = toBool(dispoRaw);
    if (dispo !== undefined) update.disponible = dispo;

    const specs = parseJsonMaybe(specsRaw);
    if (specs !== undefined) update.specifications = specs;

    const updated = await Vehicule.findByIdAndUpdate(id, update, { new: true });

    res.json({ success: true, vehicule: updated });
  } catch (error) {
    console.log("❌ ERROR EDIT :", error);
    res.json({ success: false, message: error.message });
  }
};

// 🗑 Supprimer un véhicule
export const deleteVehicule = async (req, res) => {
  try {
    // Ici tu supprimes juste le doc.
    // (Optionnel) pour supprimer sur Cloudinary aussi, stocke publicId en DB.
    await Vehicule.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Véhicule supprimé" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Obtenir tous les véhicules
export const getAllVehicules = async (req, res) => {
  try {
    const vehicules = await Vehicule.find().sort({ createdAt: -1 });
    res.json({ success: true, vehicules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Obtenir un véhicule par slug
export const getVehiculeBySlug = async (req, res) => {
  try {
    const vehicule = await Vehicule.findOne({ slug: req.params.slug });
    if (!vehicule) {
      return res.json({ success: false, message: "Véhicule introuvable" });
    }
    res.json({ success: true, vehicule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Véhicules similaires
export const getRelatedVehicules = async (req, res) => {
  try {
    const current = await Vehicule.findOne({ slug: req.params.slug });
    if (!current) return res.json({ success: false, vehicules: [] });

    const related = await Vehicule.find({
      type: current.type,
      _id: { $ne: current._id },
    }).limit(6);

    res.json({ success: true, vehicules: related });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};