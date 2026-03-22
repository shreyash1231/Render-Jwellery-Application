const mongoose = require("mongoose");

const customOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["BULK", "BRIDESMAID", "BESTMAN", "SINGLE"],
      required: true,
      index: true, // ❌ NOT unique (users can create multiple orders)
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

/* ---------- INDEXES (SAFE & USEFUL) ---------- */
customOrderSchema.index({ userId: 1, createdAt: -1 });
customOrderSchema.index({ status: 1, createdAt: -1 });
customOrderSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model("CustomOrder", customOrderSchema);
