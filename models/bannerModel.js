const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

bannerSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Banner", bannerSchema);
