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
  stocks: {
    type: Number,
    default: 0,
  },
});

categorySchema.index({ name: 1 });
categorySchema.index({ stocks: -1 });

module.exports = mongoose.model("Category", categorySchema);
