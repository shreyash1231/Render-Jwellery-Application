const mongoose = require("mongoose");

// The admin's display order of products inside one category (Admin > Product Order).
// Products of the category that are not in `products` (e.g. added later) are shown
// after these, newest first. No document = default order (newest first).
const categoryProductOrderSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      unique: true,
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CategoryProductOrder", categoryProductOrderSchema);
