const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },

    isVerified: { type: Boolean, default: false },

    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },

    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);