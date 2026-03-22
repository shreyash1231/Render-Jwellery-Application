const reelsService = require("../../services/reelsService");
const {
  createReelValidation,
  updateReelValidation,
} = require("../../validation/reelsValidation");
const asyncHandler = require("../../utils/asyncHandler");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");
const validationError = require("../../utils/validationError");
const { uploadFileToS3 } = require("../../middleware/uploadFile");

const reelsController = {
  createReel: asyncHandler(async (req, res) => {
    const reqObj = req.body;

    let videoUrl = null;
    let imageUrl = null;

    /**
     * CASE 1: single file upload
     */
    if (req.file) {
      const mimeType = req.file.mimetype;

      if (mimeType.startsWith("video/")) {
        videoUrl = await uploadFileToS3(req.file);
      }
    }

    /**
     * CASE 2: multiple files upload
     */
    if (req.files) {
      if (req.files.video?.[0]) {
        videoUrl = await uploadFileToS3(req.files.video[0]);
      }

    
    }

    if (videoUrl) reqObj.videoUrl = videoUrl;

    if (!videoUrl) {
      return errorHandler(
        { statusCode: 400, message: "Video is required" },
        req,
        res,
      );
    }

    const { error, value } = createReelValidation(reqObj);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res,
      );
    }

    // Save
    const result = await reelsService.createReel(value);

    return successHandler(res, 201, "Reel created successfully", result);
  }),

  // GET ALL REELS
  getReels: asyncHandler(async (req, res) => {
    const result = await reelsService.getReels();
    return successHandler(res, 200, "Reels fetched successfully", result.data);
  }),

  // GET REEL BY ID
  getReelById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await reelsService.getReelById(id);
    return successHandler(res, 200, "Reel fetched successfully", result.data);
  }),

  updateReel: asyncHandler(async (req, res) => {
    let reqObj = { ...req.body };

    let videoUrl = null;
    let imageUrl = null;

    /**
     * CASE 1: single file upload
     */
    if (req.file) {
      const mimeType = req.file.mimetype;

      if (mimeType.startsWith("video/")) {
        videoUrl = await uploadFileToS3(req.file);
      }
    }

    /**
     * CASE 2: multiple files upload
     */
    if (req.files) {
      if (req.files.video?.[0]) {
        videoUrl = await uploadFileToS3(req.files.video[0]);
      }

    }

    // Attach URLs if uploaded
    if (videoUrl) reqObj.videoUrl = videoUrl;

    // ✅ VALIDATE AFTER media is attached
    const { error, value } = updateReelValidation(reqObj);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res,
      );
    }

    const { id } = req.params;

    const result = await reelsService.updateReel(id, value);

    return successHandler(res, 200, "Reel updated successfully", result);
  }),

  // DELETE REEL
  deleteReel: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await reelsService.deleteReel(id);
    return successHandler(res, 200, result.message);
  }),
};

module.exports = reelsController;
