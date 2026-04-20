const ProductService = require("../../services/productService");
const {
  createProductValidation,
  updateProductValidation,
} = require("../../validation/productValidation");
const asyncHandler = require("../../utils/asyncHandler");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");
const validationError = require("../../utils/validationError");
const { uploadFileToS3 } = require("../../middleware/uploadFile");

const productController = {

  getbestSellerProducts: asyncHandler(async (req, res) => {
    const result = await ProductService.getallbestSellerProducts(req.query);
    return successHandler(res, 200, result.message, result.data);
  }),

  getAllProducts: asyncHandler(async (req, res) => {
    const result = await ProductService.getAllProducts(req.query);
    return successHandler(res, 200, result.message, result.data);
  }),

  getAllShoptolook: asyncHandler(async (req, res) => {
    const result = await ProductService.getAllShoptolookService();
    return successHandler(res, 200, "Shoptolook products fetched successfully", result);
  }),

  getProductById: asyncHandler(async (req, res) => {
    const result = await ProductService.getProductById(req.params.id);

    if (!result.data) {
      return errorHandler(
        { statusCode: 404, message: "Product not found" },
        req,
        res
      );
    }

    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = productController;
