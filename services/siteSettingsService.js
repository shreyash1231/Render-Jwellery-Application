const SiteSettings = require("../models/siteSettingsModel");

// Used until the admin saves settings, so new features stay hidden on deploy
const DEFAULT_SETTINGS = {
  newFeaturesEnabled: false,
};

class SiteSettingsService {
  async getSettings() {
    const settings = await SiteSettings.findOne().lean();
    return {
      success: true,
      message: "Site settings fetched successfully",
      data: settings || DEFAULT_SETTINGS,
    };
  }

  async updateSettings(data) {
    const settings = await SiteSettings.findOneAndUpdate(
      {},
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    return {
      success: true,
      message: "Site settings updated successfully",
      data: settings,
    };
  }
}

module.exports = new SiteSettingsService();
