const mongoose = require("mongoose");

// Homepage slots a collection can be shown in, top to bottom
const PLACEMENTS = [
  "after_banner",
  "after_signature",
  "after_categories",
  "after_best_sellers",
  "after_shop_the_look",
  "after_dulhan",
];

// A hand-picked group of products (e.g. Wedding Gifts, Under ₹1,000).
// items keeps the chosen categories in display order, each with its chosen products in display order.
const collectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    items: [
      {
        _id: false,
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },
        products: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
        ],
      },
    ],
    // Where the collection sits on the homepage
    placement: {
      type: String,
      enum: PLACEMENTS,
      default: "after_categories",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    /* ---------- SEO ---------- */
    // Short intro shown at the top of the collection page (also the fallback meta description)
    description: { type: String, trim: true, default: "" },
    // Readable URL: /collections/<slug>. Made from the title when left empty.
    slug: { type: String, trim: true, lowercase: true },
    slugHistory: { type: [String], default: [] },
    metaTitle: { type: String, trim: true, default: "" },
    metaDescription: { type: String, trim: true, default: "" },
    metaKeywords: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

collectionSchema.index({ title: 1 });
collectionSchema.index({ slug: 1 }, { unique: true, sparse: true });
collectionSchema.index({ slugHistory: 1 });

module.exports = mongoose.model("Collection", collectionSchema);
module.exports.PLACEMENTS = PLACEMENTS;
