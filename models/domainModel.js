const mongoose = require("mongoose");

const domainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

domainSchema.index({ isActive: 1 });
domainSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Domain", domainSchema);
