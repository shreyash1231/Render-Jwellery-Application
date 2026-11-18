const mongoose = require("mongoose");

// Extra categories a product is listed in, on top of its main category (product.categoryId).
// One document per product + category pair. Inactive links are kept but the product
// doesn't show in that category on the website.
const productCategorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

productCategorySchema.index({ product: 1, category: 1 }, { unique: true });
productCategorySchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model("ProductCategory", productCategorySchema);
