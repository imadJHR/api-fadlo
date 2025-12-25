import Vehicule from "../models/vehiculeModel.js";

// ➕ Ajouter un véhicule
export const addVehicule = async (req, res) => {
  try {
    const {
      nom,
      marque,
      type,
      prixParJour,
      description,
      vedette,
      disponible,
      specifications,
    } = req.body;

    const images = req.files?.map((file) =>
      file.path.replace(/\\/g, "/")
    ) || [];

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

export const editVehicule = async (req, res) => {
  try {
    const { id } = req.params;

    const imagesExistantes = req.body.imagesExistantes
      ? JSON.parse(req.body.imagesExistantes)
      : [];

    const newImages = req.files
      ? req.files.map((file) => file.path.replace(/\\/g, "/"))
      : [];

    const imagesFinales = [...imagesExistantes, ...newImages];

    const updated = await Vehicule.findByIdAndUpdate(
      id,
      {
        ...req.body,
        images: imagesFinales,
      },
      { new: true }
    );

    res.json({ success: true, vehicule: updated });
  } catch (error) {
    console.log("❌ ERROR EDIT :", error);
    res.json({ success: false, message: error.message });
  }
};

// 🗑 Supprimer un véhicule
export const deleteVehicule = async (req, res) => {
  try {
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
export const getRelatedVehicules = async (req, res) => {
  try {
    const current = await Vehicule.findOne({ slug: req.params.slug })
    if (!current) return res.json({ success: false, vehicules: [] })

    const related = await Vehicule.find({
      type: current.type,
      _id: { $ne: current._id }
    }).limit(6)

    res.json({ success: true, vehicules: related })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

