const mongoose = require("mongoose");

const realSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

realSchema.index({ createdAt: -1 });
realSchema.index({ price: 1 });

module.exports = mongoose.models.Real || mongoose.model("Reels", realSchema);
