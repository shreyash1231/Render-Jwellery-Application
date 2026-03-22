const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["PERCENT", "AMOUNT"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    maxDiscount: {
      type: Number,
    },
    minOrderValue: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
    },
    usageLimit: {
      type: Number,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    perUserLimit: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

couponSchema.index({ isActive: 1, expiresAt: 1 });
couponSchema.index({ isActive: 1, minOrderValue: 1 });

module.exports = mongoose.model("Coupon", couponSchema);
