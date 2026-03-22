const mongoose = require("mongoose");

const getInTouchSchema = new mongoose.Schema(
  {
    address: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, trim: true },
      country: { type: String, required: true, trim: true },
      zipCode: { type: String, trim: true },
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    socialLinks: {
      facebook: { type: String, trim: true },
      twitter: { type: String, trim: true },
      instagram: { type: String, trim: true },
      linkedin: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

getInTouchSchema.index({ createdAt: -1 });
getInTouchSchema.index({ "address.city": 1, "address.country": 1 });

module.exports = mongoose.model("GetInTouch", getInTouchSchema);
