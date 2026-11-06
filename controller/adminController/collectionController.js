const asyncHandler = require("../../utils/asyncHandler");
const collectionService = require("../../services/collectionService");
const {
  createCollectionValidation,
  updateCollectionValidation,
} = require("../../validation/collectionValidation");
const validationError = require("../../utils/validationError");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");

const collectionController = {
  createCollection: asyncHandler(async (req, res) => {
    const { error, value } = createCollectionValidation(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res
      );
    }

    const result = await collectionService.createCollection(value);
    return successHandler(res, 201, result.message, result.data);
  }),

  getAllCollections: asyncHandler(async (req, res) => {
    const result = await collectionService.getAllCollections();
    return successHandler(res, 200, result.message, result.data);
  }),

  getCollectionById: asyncHandler(async (req, res) => {
    const result = await collectionService.getCollectionById(req.params.id);
    return successHandler(res, 200, result.message, result.data);
  }),

  updateCollection: asyncHandler(async (req, res) => {
    const { error, value } = updateCollectionValidation(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res
      );
    }

    const result = await collectionService.updateCollection(req.params.id, value);
    return successHandler(res, 200, result.message, result.data);
  }),

  deleteCollection: asyncHandler(async (req, res) => {
    const result = await collectionService.deleteCollection(req.params.id);
    return successHandler(res, 200, result.message, null);
  }),
};

module.exports = collectionController;
