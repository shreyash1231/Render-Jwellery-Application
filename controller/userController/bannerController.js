const asyncHandler = require("../../utils/asyncHandler");
const bannerService = require("../../services/bannerService");
const {
  createBannerValidation,
  updateBannerValidation,
} = require("../../validation/bannerValidation");
const validationError = require("../../utils/validationError");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");
const { uploadFileToS3 } = require("../../middleware/uploadFile");

const bannerController = {
  getAllBanners: asyncHandler(async (req, res) => {
    const result = await bannerService.getAllBanners();
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = bannerController;
