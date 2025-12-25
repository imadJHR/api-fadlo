import mongoose from "mongoose";
import slugify from "slugify";

const vehiculeSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    marque: { type: String, required: true },
    type: { type: String, required: true },
    prixParJour: { type: Number, required: true },
    description: { type: String, required: true },
    vedette: { type: Boolean, default: false },
    disponible: { type: Boolean, default: true },

    specifications: {
      seats: Number,
      fuel: String,
      transmission: String,
    },

    images: [String],

    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

// 🔥 HOOK SANS next() -> CORRECTION DEFINITIVE
vehiculeSchema.pre("save", function () {
  if (this.nom) {
    this.slug = slugify(this.nom, {
      lower: true,
      strict: true,
    });
  }
});

// 👉 S'assurer qu'aucun duplicate slug ne casse la BDD
vehiculeSchema.pre("save", async function () {
  if (!this.slug) return;

  const exists = await mongoose.models.Vehicule.findOne({
    slug: this.slug,
    _id: { $ne: this._id },
  });

  if (exists) {
    this.slug = `${this.slug}-${Date.now()}`;
  }
});

const Vehicule = mongoose.model("Vehicule", vehiculeSchema);
export default Vehicule;
