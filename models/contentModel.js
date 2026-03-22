const mongoose = require("mongoose");

const StaticContentTypes = [
  "PRIVACY_POLICY",
  "TERMS_AND_CONDITIONS",
  "ABOUT_US",
  "SHIPPING_POLICY",
  "EXCHANGE_POLICY"
];

const staticContentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: StaticContentTypes,
      required: true,
      unique: true, // ✅ unique index only
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ✅ Schema-level indexes only
staticContentSchema.index({ isActive: 1 });
staticContentSchema.index({ createdAt: -1 });

module.exports = {
  StaticContent: mongoose.model("StaticContent", staticContentSchema),
  StaticContentTypes,
};
