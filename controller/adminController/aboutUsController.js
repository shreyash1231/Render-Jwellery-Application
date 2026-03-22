const asyncHandler = require("../../utils/asyncHandler");
const aboutUsService = require("../../services/aboutUsService");
const successHandler = require("../../middleware/globalSuccessHandler");
const { uploadFileToS3 } = require("../../middleware/uploadFile");

const aboutUsController = {
  /* -------- CREATE -------- */
  createAboutUs: asyncHandler(async (req, res) => {
    const { type } = req.body;

    if (!req.file) {
      throw new Error("Image is required");
    }

    const image = await uploadFileToS3(req.file);

    const result = await aboutUsService.createAboutUs({ type, image });
    return successHandler(res, 201, result.message, result.data);
  }),

  /* -------- GET ALL -------- */
  getAboutUs: asyncHandler(async (req, res) => {
    const result = await aboutUsService.getAboutUs();
    return successHandler(res, 200, result.message, result.data);
  }),

  /* -------- UPDATE BY ID -------- */
  updateAboutUs: asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!req.file) {
      throw new Error("Image is required");
    }

    const image = await uploadFileToS3(req.file);

    const result = await aboutUsService.updateAboutUs(id, image);
    return successHandler(res, 200, result.message, result.data);
  }),

  /* -------- DELETE BY ID -------- */
  deleteAboutUs: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await aboutUsService.deleteAboutUs(id);
    return successHandler(res, 200, result.message, null);
  }),
};

module.exports = aboutUsController;
