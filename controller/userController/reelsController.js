const asyncHandler = require("../../utils/asyncHandler");
const reelsService = require("../../services/reelsService");
const {
  createReelValidation,
  updateReelValidation,
} = require("../../validation/reelsValidation");
const { errorHandler, successHandler } = require("../utils/responseHandler");
const { validationError } = require("../utils/validationError");
const uploadFileToS3 = require("../utils/uploadFileToS3"); 

const reelsController = {

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


};

module.exports = reelsController;
