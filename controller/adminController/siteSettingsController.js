const asyncHandler = require("../../utils/asyncHandler");
const siteSettingsService = require("../../services/siteSettingsService");
const { updateSiteSettingsValidation } = require("../../validation/siteSettingsValidation");
const validationError = require("../../utils/validationError");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");

const siteSettingsController = {
  getSettings: asyncHandler(async (req, res) => {
    const result = await siteSettingsService.getSettings();
    return successHandler(res, 200, result.message, result.data);
  }),

  updateSettings: asyncHandler(async (req, res) => {
    const { error, value } = updateSiteSettingsValidation(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res
      );
    }

    const result = await siteSettingsService.updateSettings(value);
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = siteSettingsController;
