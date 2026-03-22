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
  },
  { timestamps: true },
);

productSchema.index({ categoryId: 1, isActive: 1 });
productSchema.index({ isActive: 1, createdAt: -1 });
productSchema.index({ sellingPrice: 1 });
productSchema.index({ quantity: 1 });

module.exports = mongoose.model('Product', productSchema);
