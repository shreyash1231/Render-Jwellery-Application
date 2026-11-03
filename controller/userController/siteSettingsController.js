const asyncHandler = require("../../utils/asyncHandler");
const siteSettingsService = require("../../services/siteSettingsService");
const successHandler = require("../../middleware/globalSuccessHandler");

const siteSettingsController = {
  getSettings: asyncHandler(async (req, res) => {
    const result = await siteSettingsService.getSettings();
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = siteSettingsController;
