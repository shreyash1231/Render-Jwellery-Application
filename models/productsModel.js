const { required } = require('joi');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    bestSeller: {
  type: Boolean,
  default: false,
},

    mrp: {
      type: Number,
      required: true,
    },

    sellingPrice: {
      type: Number,
      required: true,
    },

    imageUrl: {
      type: [String],
      default: [],
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    shipmentType: {
      type: String,
      enum: ['ship', 'order'],
      default: 'ship',
    },

    quantity: {
      type: Number,
      default: 0,
    },


    benefits: String,
    features: String,
    use: String,
    additionalInfo: String,

    /* ---------- FAQs SECTION ---------- */
    faqs: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    /* ---------- SEO ---------- */
    // Readable URL: /product/<slug>. Made from the name when left empty.
    slug: { type: String, trim: true, lowercase: true },
    // Slugs used before, so old links still reach the product
    slugHistory: { type: [String], default: [] },
    // e.g. bridal, potli, return gift. Used for meta keywords and "related products".
    tags: { type: [String], default: [] },
    // Empty = filled from the product name / description on the website
    metaTitle: { type: String, trim: true, default: "" },
    metaDescription: { type: String, trim: true, default: "" },
    metaKeywords: { type: String, trim: true, default: "" },

    // Kept in step with the product's visible reviews by reviewService
    ratingAverage: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

productSchema.index({ categoryId: 1, isActive: 1 });
productSchema.index({ isActive: 1, createdAt: -1 });
productSchema.index({ sellingPrice: 1 });
productSchema.index({ quantity: 1 });
productSchema.index({ slug: 1 }, { unique: true, sparse: true });
productSchema.index({ slugHistory: 1 });
productSchema.index({ tags: 1 });

module.exports = mongoose.model('Product', productSchema);
