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
});

categorySchema.index({ name: 1 });
categorySchema.index({ stocks: -1 });
categorySchema.index({ parentCategory: 1 });

module.exports = mongoose.model("Category", categorySchema);
