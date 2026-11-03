const mongoose = require("mongoose");

// Single settings document for site-wide switches
const siteSettingsSchema = new mongoose.Schema(
  {
    // Turns on the marquee, sub-category, discount badge and coupon updates on the website
    newFeaturesEnabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
