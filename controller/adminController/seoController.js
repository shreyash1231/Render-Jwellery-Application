const asyncHandler = require("../../utils/asyncHandler");
const seoService = require("../../services/seoService");
const { updateSeoSettingsValidation } = require("../../validation/seoValidation");
const validationError = require("../../utils/validationError");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");

const seoController = {
  getSettings: asyncHandler(async (req, res) => {
    const result = await seoService.getSettings();
    return successHandler(res, 200, result.message, result.data);
  }),

  updateSettings: asyncHandler(async (req, res) => {
    const { error, value } = updateSeoSettingsValidation(req.body);
    if (error) {
      return errorHandler({ statusCode: 400, message: validationError(error) }, req, res);
    }
    const result = await seoService.updateSettings(value);
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = seoController;
