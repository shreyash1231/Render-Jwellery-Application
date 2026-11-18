const mongoose = require("mongoose");

const MEDIA_TYPES = ["image", "video"];

// A product review written by the admin. Customers can't post reviews themselves.
// The reviewer is either a real customer (user) or just a display name (reviewerName only).
const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // Set only when the review is linked to a real customer account
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Name shown on the website; for a linked customer it is copied from their account
    reviewerName: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      default: "",
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    media: [
      {
        _id: false,
        type: { type: String, enum: MEDIA_TYPES, required: true },
        url: { type: String, required: true },
      },
    ],
    // Date and time the review is shown as written
    reviewedAt: {
      type: Date,
      default: Date.now,
    },
    // Hidden reviews don't show on the website or count towards the rating
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, isActive: 1, reviewedAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);
module.exports.MEDIA_TYPES = MEDIA_TYPES;
