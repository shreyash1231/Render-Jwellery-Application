const mongoose = require("mongoose");

const shoptolookSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    videoUrl:    { type: String, required: true },
    imageUrl:    { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shoptolook", shoptolookSchema);