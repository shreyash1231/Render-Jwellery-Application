const mongoose = require("mongoose");

// Website pages that have their own Google title/description, edited from Admin > SEO Settings.
// Keys match the storefront routes.
const SEO_PAGES = [
  { key: "home", label: "Home", path: "/" },
  { key: "categories", label: "All Categories", path: "/categories" },
  { key: "aboutUs", label: "About Us", path: "/aboutUs" },
  { key: "contactUs", label: "Contact Us", path: "/contactUs" },
  { key: "customOrders", label: "Custom Orders", path: "/custom-orders" },
  { key: "privacyPolicy", label: "Privacy Policy", path: "/privacy-policy" },
  { key: "terms", label: "Terms & Conditions", path: "/terms" },
  { key: "shippingPolicy", label: "Shipping Policy", path: "/shipping-policy" },
  { key: "exchangePolicy", label: "Exchange Policy", path: "/exchange-policy" },
];

const pageSeoSchema = new mongoose.Schema(
  {
    key: { type: String, enum: SEO_PAGES.map((p) => p.key), required: true },
    metaTitle: { type: String, trim: true, default: "" },
    metaDescription: { type: String, trim: true, default: "" },
    metaKeywords: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

// Single document
const seoSettingsSchema = new mongoose.Schema(
  {
    siteUrl: { type: String, trim: true, default: "" },
    siteName: { type: String, trim: true, default: "" },
    defaultMetaTitle: { type: String, trim: true, default: "" },
    defaultMetaDescription: { type: String, trim: true, default: "" },
    defaultMetaKeywords: { type: String, trim: true, default: "" },
    // Image used when a page is shared and has no image of its own (S3 path or full URL)
    defaultShareImage: { type: String, trim: true, default: "" },
    pages: { type: [pageSeoSchema], default: [] },
    // Empty = the website's built-in robots.txt
    robotsTxt: { type: String, default: "" },
    // Pasted as-is into <head> / end of <body> (Analytics, Meta Pixel, verification, chat widget)
    headerScripts: { type: String, default: "" },
    footerScripts: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SeoSettings", seoSettingsSchema);
module.exports.SEO_PAGES = SEO_PAGES;
