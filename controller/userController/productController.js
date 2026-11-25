const ProductService = require("../../services/productService");
const discountService = require("../../services/discountService");
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
    await discountService.applyOffers(result.data.products);
    return successHandler(res, 200, result.message, result.data);
  }),

  getAllProducts: asyncHandler(async (req, res) => {
    const result = await ProductService.getAllProducts(req.query);
    await discountService.applyOffers(result.data.products);
    return successHandler(res, 200, result.message, result.data);
  }),

  getAllShoptolook: asyncHandler(async (req, res) => {
    const result = await ProductService.getAllShoptolookService();
    return successHandler(res, 200, "Shoptolook products fetched successfully", result);
  }),

  // By id, URL slug or an older slug
  getProductById: asyncHandler(async (req, res) => {
    const result = await ProductService.getProductByKey(req.params.id);

    if (!result.data) {
      return errorHandler(
        { statusCode: 404, message: "Product not found" },
        req,
        res
      );
    }

    await discountService.applyOffers([result.data]);
    return successHandler(res, 200, result.message, result.data);
  }),

  // Products sharing the most tags first, then others from the same categories
  getRelatedProducts: asyncHandler(async (req, res) => {
    const result = await ProductService.getRelatedProducts(req.params.id, req.query.limit);
    await discountService.applyOffers(result.data.products);
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = productController;
