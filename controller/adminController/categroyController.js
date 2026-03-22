const errorHandler = require('../../middleware/globalErrorHandler');
const successHandler = require('../../middleware/globalSuccessHandler');
const CategoryService = require('../../services/categoryService');
const {
  createCategoryValidation,
  updateCategoryValidation,
} = require('../../validation/categoryValidation');
const asyncHandler = require('../../utils/asyncHandler');
const validationError = require('../../utils/validationError');
const { uploadFileToS3 } = require('../../middleware/uploadFile');

const categoryController = {
  createCategory: asyncHandler(async (req, res) => {
    if (req.files?.image?.[0]) {
      const imageUrl = await uploadFileToS3(req.files.image[0]);
      req.body.imageUrl = imageUrl;
    }
    if (req.files?.logo?.[0]) {
      const logoUrl = await uploadFileToS3(req.files.logo[0]);
      req.body.logo = logoUrl;
    }

    const { error } = createCategoryValidation(req.body);

    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res,
      );
    }

    const result = await CategoryService.createCategory(req.body);
    return successHandler(res, 201, result.message, result.data);
  }),

  getAllCategories: asyncHandler(async (req, res) => {
    const result = await CategoryService.getAllCategories();
    return successHandler(res, 200, result.message, result.data);
  }),

  getCategoryById: asyncHandler(async (req, res) => {
    const result = await CategoryService.getCategoryById(req.params.id);

    if (!result.data) {
      return errorHandler(
        { statusCode: 404, message: 'Category not found' },
        req,
        res,
      );
    }

    return successHandler(res, 200, result.message, result.data);
  }),

  updateCategory: asyncHandler(async (req, res) => {
    if (req.files?.image?.[0]) {
      const imageUrl = await uploadFileToS3(req.files.image[0]);
      req.body.imageUrl = imageUrl;
    }
    if (req.files?.logo?.[0]) {
      const logoUrl = await uploadFileToS3(req.files.logo[0]);
      req.body.logo = logoUrl;
    }

    const { error } = updateCategoryValidation(req.body);

    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res,
      );
    }

    const result = await CategoryService.updateCategory(
      req.params.id,
      req.body,
    );

    if (!result.data) {
      return errorHandler(
        { statusCode: 404, message: 'Category not found' },
        req,
        res,
      );
    }

    return successHandler(res, 200, result.message, result.data);
  }),

  deleteCategory: asyncHandler(async (req, res) => {
    const result = await CategoryService.deleteCategory(req.params.id);

    if (!result.data) {
      return errorHandler(
        { statusCode: 404, message: 'Category not found' },
        req,
        res,
      );
    }

    return successHandler(res, 200, result.message, null);
  }),

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
