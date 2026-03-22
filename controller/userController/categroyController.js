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
};

module.exports = categoryController;
