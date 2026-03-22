const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["background", "top", "bottom"],
      required: true,
      unique: true, // 🔒 only one image per type
    },

    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AboutUs", aboutUsSchema);
