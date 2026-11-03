const mongoose = require("mongoose");

// Single settings document for the scrolling bar at the top of the website
const marqueeSchema = new mongoose.Schema(
  {
    messages: {
      type: [String],
      default: [],
    },
    textColor: {
      type: String,
      default: "#f4e8dc",
    },
    backgroundColor: {
      type: String,
      default: "#2a2016",
    },
    // seconds for one full scroll; lower = faster
    speed: {
      type: Number,
      default: 25,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Marquee", marqueeSchema);
