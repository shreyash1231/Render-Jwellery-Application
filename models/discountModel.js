const mongoose = require("mongoose");

const SCOPES = ["category", "products"];
const TYPES = ["percentage", "flat"];

// A price offer on one category: either every product in it ("category")
// or only the chosen products ("products"), each of which can be switched off on its own.
// Runs between startDate and endDate while isActive is on.
const discountSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    scope: {
      type: String,
      enum: SCOPES,
      default: "category",
    },
    products: [
      {
        _id: false,
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    // percentage: value is % off the selling price; flat: value is ₹ off the selling price
    type: {
      type: String,
      enum: TYPES,
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

discountSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
discountSchema.index({ category: 1 });

module.exports = mongoose.model("Discount", discountSchema);
module.exports.SCOPES = SCOPES;
module.exports.TYPES = TYPES;
