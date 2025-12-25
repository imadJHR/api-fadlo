import mongoose from "mongoose";
import slugify from "slugify";

const brandSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

// Generate slug
brandSchema.pre("save", function () {
  if (this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
});

// Avoid duplicate slug
brandSchema.pre("save", async function () {
  const exists = await mongoose.models.Brand.findOne({
    slug: this.slug,
    _id: { $ne: this._id },
  });

  if (exists) {
    this.slug = `${this.slug}-${Date.now()}`;
  }
});

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
