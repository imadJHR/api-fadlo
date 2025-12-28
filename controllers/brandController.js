import Brand from "../models/brandModel.js";

// ➕ CREATE BRAND
export const addBrand = async (req, res) => {
  try {
    const { title } = req.body;

    // vient du middleware uploadBrandCloudinary
    const image = req.uploadedImage?.url || null;

    if (!image) {
      return res.json({ success: false, message: "Brand image required" });
    }

    const brand = new Brand({ title, image });

    await brand.save();
    res.json({ success: true, brand });
  } catch (error) {
    console.log("❌ ERROR ADD BRAND:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✏ UPDATE BRAND
export const editBrand = async (req, res) => {
  try {
    const { id } = req.params;

    // si nouvelle image uploadée, on prend celle-là, sinon on garde l’ancienne envoyée dans body
    const image = req.uploadedImage?.url || req.body.image;

    const updated = await Brand.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        image,
      },
      { new: true }
    );

    res.json({ success: true, brand: updated });
  } catch (error) {
    console.log("❌ ERROR EDIT BRAND:", error);
    res.json({ success: false, message: error.message });
  }
};

// 🗑 DELETE BRAND
export const deleteBrand = async (req, res) => {
  try {
    // Ici on supprime seulement le document.
    // Pour supprimer aussi l'image Cloudinary, il faut stocker publicId dans la DB.
    await Brand.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Brand deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 GET ALL BRANDS
export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.json({ success: true, brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};