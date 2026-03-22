const asyncHandler = require("../../utils/asyncHandler");
const aboutUsService = require("../../services/aboutUsService");
const successHandler = require("../../middleware/globalSuccessHandler");
const { uploadFileToS3 } = require("../../middleware/uploadFile");

const aboutUsController = {
  getAboutUs: asyncHandler(async (req, res) => {
    const result = await aboutUsService.getAboutUs();
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = aboutUsController;
