const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },

    /* ---------- PAYMENT MODE ---------- */
    paymentMethod: {
      type: String,
      enum: ["ONLINE", "COD"],
      default: "ONLINE",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["CREATED", "PAID", "FAILED", "REFUNDED", "PENDING"],
      default: "CREATED",
      index: true,
    },

    provider: {
      type: String,
      enum: ["RAZORPAY", "STRIPE", "COD"],
      default: "RAZORPAY",
      index: true,
    },

    /* ---------- ONLINE PAYMENT FIELDS ---------- */
    razorpayOrderId: {
      type: String,
      index: true,
      sparse: true,
    },

    razorpayPaymentId: {
      type: String,
      index: true,
      sparse: true,
    },

    razorpaySignature: String,

    /* ---------- COD FIELDS ---------- */
    codVerified: {
      type: Boolean,
      default: false,
    },

    failureReason: String,
  },
  { timestamps: true }
);

/* ---------- COMPOUND INDEXES ---------- */
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ paymentStatus: 1, createdAt: -1 });

module.exports = mongoose.model("Payment", paymentSchema);
