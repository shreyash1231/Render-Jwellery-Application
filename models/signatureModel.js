const mongoose = require("mongoose");

const signatureSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },

    layoutType: {
      type: String,
      enum: ["tall", "small"],
      required: true,
    },

    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

signatureSchema.index({ order: 1 });
signatureSchema.index({ layoutType: 1, order: 1 });
signatureSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Signature", signatureSchema);
