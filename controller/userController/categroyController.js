const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");
const CategoryService = require("../../services/categoryService");
const {
  createCategoryValidation,
  updateCategoryValidation,
} = require("../../validation/categoryValidation");
const asyncHandler = require("../../utils/asyncHandler");
const validationError = require("../../utils/validationError");

const categoryController = {
  getShopByFuncCategories: asyncHandler(async (req, res) => {
    const result = await CategoryService.getShopByFuncCategories();
    return successHandler(res, 200, result.message, result.data);
  }),

  getShopByProdCategories: asyncHandler(async (req, res) => {
    const result = await CategoryService.getShopByProdCategories();
    return successHandler(res, 200, result.message, result.data);
  }),

  getCategoryByKey: asyncHandler(async (req, res) => {
    const result = await CategoryService.getCategoryByKey(req.params.key);
    if (!result.data) {
      return errorHandler({ statusCode: 404, message: "Category not found" }, req, res);
    }
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = categoryController;
