const mongoose = require("mongoose");

const DELIVERY_DAYS_TYPES = ["fixed", "range"];

// Single settings document for site-wide switches
const siteSettingsSchema = new mongoose.Schema(
  {
    // Turns on the marquee, sub-category, discount badge and coupon updates on the website
    newFeaturesEnabled: {
      type: Boolean,
      default: false,
    },

    /* ---------- Delivery (product page pincode check + checkout) ---------- */
    // Charged on orders up to freeDeliveryAbove
    deliveryCharge: {
      type: Number,
      default: 200,
      min: 0,
    },
    // Orders above this total ship free; 0 means delivery is always charged
    freeDeliveryAbove: {
      type: Number,
      default: 5000,
      min: 0,
    },
    // fixed: arrives in deliveryDaysMin days; range: between deliveryDaysMin and deliveryDaysMax days
    deliveryDaysType: {
      type: String,
      enum: DELIVERY_DAYS_TYPES,
      default: "range",
    },
    deliveryDaysMin: {
      type: Number,
      default: 3,
      min: 0,
    },
    deliveryDaysMax: {
      type: Number,
      default: 7,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
module.exports.DELIVERY_DAYS_TYPES = DELIVERY_DAYS_TYPES;
