const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  logo: {
    type: String,
  },
  isShopByProduct:{
    type:Boolean,
    default:false
  },
  // null = top-level category; otherwise shown inside its parent (e.g. Birthday inside Gift Item)
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  stocks: {
    type: Number,
    default: 0,
  },

  /* ---------- SEO ---------- */
  // Readable URL: /categories/<slug>. Made from the name when left empty.
  slug: { type: String, trim: true, lowercase: true },
  slugHistory: { type: [String], default: [] },
  // Empty = filled from the category name / description on the website
  metaTitle: { type: String, trim: true, default: "" },
  metaDescription: { type: String, trim: true, default: "" },
  metaKeywords: { type: String, trim: true, default: "" },
}, { timestamps: true });

categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 }, { unique: true, sparse: true });
categorySchema.index({ slugHistory: 1 });
categorySchema.index({ stocks: -1 });
categorySchema.index({ parentCategory: 1 });

module.exports = mongoose.model("Category", categorySchema);
