const SiteSettings = require("../models/siteSettingsModel");

// Used until the admin saves settings, so new features stay hidden on deploy.
// Delivery defaults match the old fixed rule: ₹200 on orders up to ₹5000.
const DEFAULT_SETTINGS = {
  newFeaturesEnabled: false,
  deliveryCharge: 200,
  freeDeliveryAbove: 5000,
  deliveryDaysType: "range",
  deliveryDaysMin: 3,
  deliveryDaysMax: 7,
};

class SiteSettingsService {
  async getSettings() {
    const settings = await SiteSettings.findOne().lean();
    return {
      success: true,
      message: "Site settings fetched successfully",
      // Older settings documents don't have the delivery fields yet
      data: { ...DEFAULT_SETTINGS, ...(settings || {}) },
    };
  }

  async updateSettings(data) {
    const settings = await SiteSettings.findOneAndUpdate(
      {},
      { $set: data },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).lean();

    return {
      success: true,
      message: "Site settings updated successfully",
      data: { ...DEFAULT_SETTINGS, ...settings },
    };
  }

  // Delivery charge for an order total (after coupon), using the admin's delivery settings
  async getShippingCharge(orderTotal) {
    const { data } = await this.getSettings();
    const charge = Math.max(0, Number(data.deliveryCharge) || 0);
    const freeAbove = Math.max(0, Number(data.freeDeliveryAbove) || 0);
    if (freeAbove > 0 && orderTotal > freeAbove) return 0;
    return charge;
  }
}

module.exports = new SiteSettingsService();
