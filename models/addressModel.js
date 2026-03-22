const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    label: { type: String },
    country: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

addressSchema.index({ userId: 1, isDefault: 1 });
addressSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Address", addressSchema);
