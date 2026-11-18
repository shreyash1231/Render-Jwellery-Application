const asyncHandler = require("../../utils/asyncHandler");
const reviewService = require("../../services/reviewService");
const {
  createReviewValidation,
  updateReviewValidation,
} = require("../../validation/reviewValidation");
const validationError = require("../../utils/validationError");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");
const { uploadFileToS3 } = require("../../middleware/uploadFile");

// Uploads the review's new photos/videos to S3 and returns them as media items
const uploadMedia = async (files = []) =>
  Promise.all(
    files.map(async (file) => ({
      type: file.mimetype.startsWith("video/") ? "video" : "image",
      url: await uploadFileToS3(file),
    }))
  );

const reviewController = {
  createReview: asyncHandler(async (req, res) => {
    const { error, value } = createReviewValidation(req.body);
    if (error) {
      return errorHandler({ statusCode: 400, message: validationError(error) }, req, res);
    }
    const media = await uploadMedia(req.files);
    const result = await reviewService.createReview(value, media);
    return successHandler(res, 201, result.message, result.data);
  }),

  getAllReviews: asyncHandler(async (req, res) => {
    const result = await reviewService.getAllReviews();
    return successHandler(res, 200, result.message, result.data);
  }),

  updateReview: asyncHandler(async (req, res) => {
    const { error, value } = updateReviewValidation(req.body);
    if (error) {
      return errorHandler({ statusCode: 400, message: validationError(error) }, req, res);
    }
    const media = await uploadMedia(req.files);
    const result = await reviewService.updateReview(req.params.id, value, media);
    return successHandler(res, 200, result.message, result.data);
  }),

  deleteReview: asyncHandler(async (req, res) => {
    const result = await reviewService.deleteReview(req.params.id);
    return successHandler(res, 200, result.message, null);
  }),
};

module.exports = reviewController;
