const SeoSettings = require("../models/seoSettingsModel");
const { SEO_PAGES } = require("../models/seoSettingsModel");
const Product = require("../models/productsModel");
const Category = require("../models/categoriesModal");
const Collection = require("../models/collectionModel");

const DEFAULT_SITE_URL = "https://kuchalagindia.com";

// Pages kept out of Google: cart, checkout, account and login screens
const DEFAULT_ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /checkout
Disallow: /profile
Disallow: /wishlist
Disallow: /order-history
Disallow: /custom-order-history
Disallow: /payment-success
Disallow: /signin
Disallow: /signup
Disallow: /otp
`;

const DEFAULTS = {
  siteUrl: DEFAULT_SITE_URL,
  siteName: "Kuchalag India",
  defaultMetaTitle: "Kuchalag India | Handcrafted Wedding Gifts, Potlis & Hampers",
  defaultMetaDescription:
    "Shop handcrafted wedding gifts, bridal potlis, festive hampers and return gifts from Kuchalag India. Made with love, delivered across India.",
  defaultMetaKeywords: "",
  defaultShareImage: "",
  robotsTxt: "",
  headerScripts: "",
  footerScripts: "",
};

// Every known page, with empty values for pages the admin hasn't filled yet
const withAllPages = (pages = []) =>
  SEO_PAGES.map((p) => {
    const saved = pages.find((x) => x.key === p.key) || {};
    return {
      ...p,
      metaTitle: saved.metaTitle || "",
      metaDescription: saved.metaDescription || "",
      metaKeywords: saved.metaKeywords || "",
    };
  });

class SeoService {
  async getSettings() {
    const saved = (await SeoSettings.findOne().lean()) || {};
    const data = { ...DEFAULTS };
    Object.keys(DEFAULTS).forEach((k) => {
      if (saved[k]) data[k] = saved[k];
    });
    data.siteUrl = data.siteUrl.replace(/\/+$/, "");
    data.pages = withAllPages(saved.pages);
    data.defaultRobotsTxt = DEFAULT_ROBOTS_TXT;
    data.updatedAt = saved.updatedAt || null;
    return { success: true, message: "SEO settings fetched successfully", data };
  }

  async updateSettings(data) {
    const update = { ...data };
    if (Array.isArray(update.pages)) {
      update.pages = update.pages.map(({ key, metaTitle = "", metaDescription = "", metaKeywords = "" }) => ({
        key,
        metaTitle,
        metaDescription,
        metaKeywords,
      }));
    }
    await SeoSettings.findOneAndUpdate(
      {},
      { $set: update },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    const result = await this.getSettings();
    return { ...result, message: "SEO settings updated successfully" };
  }

  // Everything the sitemap needs: active products and all categories, with their last change
  async getSitemapData() {
    const [products, categories, collections] = await Promise.all([
      Product.find({ isActive: true }).select("slug updatedAt").sort({ updatedAt: -1 }).lean(),
      Category.find().select("slug updatedAt").lean(),
      Collection.find({ isActive: true }).select("slug updatedAt").lean(),
    ]);
    return {
      success: true,
      message: "Sitemap data fetched successfully",
      data: {
        products: products.map((p) => ({ _id: p._id, slug: p.slug, updatedAt: p.updatedAt })),
        categories: categories.map((c) => ({ _id: c._id, slug: c.slug, updatedAt: c.updatedAt })),
        collections: collections.map((c) => ({ _id: c._id, slug: c.slug, updatedAt: c.updatedAt })),
      },
    };
  }
}

module.exports = new SeoService();
module.exports.DEFAULT_ROBOTS_TXT = DEFAULT_ROBOTS_TXT;
