const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    domainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Domain",
      required: true,
    },
    type: {
      type: String,
      enum: ["MOBILE", "WEB"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

projectSchema.index({ domainId: 1, isActive: 1 });
projectSchema.index({ isActive: 1, createdAt: -1 });
projectSchema.index({ country: 1, type: 1 });

module.exports = mongoose.model("Project", projectSchema);
