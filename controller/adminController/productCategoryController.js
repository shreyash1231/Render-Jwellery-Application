const asyncHandler = require("../../utils/asyncHandler");
const productCategoryService = require("../../services/productCategoryService");
const {
  saveProductCategoriesValidation,
  statusValidation,
} = require("../../validation/productCategoryValidation");
const validationError = require("../../utils/validationError");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");

const productCategoryController = {
  getAll: asyncHandler(async (req, res) => {
    const result = await productCategoryService.getAll();
    return successHandler(res, 200, result.message, result.data);
  }),

  getForProduct: asyncHandler(async (req, res) => {
    const result = await productCategoryService.getForProduct(req.params.productId);
    return successHandler(res, 200, result.message, result.data);
  }),

  save: asyncHandler(async (req, res) => {
    const { error, value } = saveProductCategoriesValidation(req.body);
    if (error) {
      return errorHandler({ statusCode: 400, message: validationError(error) }, req, res);
    }
    const result = await productCategoryService.saveForProduct(value);
    return successHandler(res, 200, result.message, result.data);
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const { error, value } = statusValidation(req.body);
    if (error) {
      return errorHandler({ statusCode: 400, message: validationError(error) }, req, res);
    }
    const result = await productCategoryService.updateStatus(req.params.id, value.isActive);
    return successHandler(res, 200, result.message, result.data);
  }),

  deleteOne: asyncHandler(async (req, res) => {
    const result = await productCategoryService.deleteOne(req.params.id);
    return successHandler(res, 200, result.message, null);
  }),

  deleteForProduct: asyncHandler(async (req, res) => {
    const result = await productCategoryService.deleteForProduct(req.params.productId);
    return successHandler(res, 200, result.message, null);
  }),
};

module.exports = productCategoryController;
