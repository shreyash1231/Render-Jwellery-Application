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
  /* ---------------- CREATE PRODUCT ---------------- */
  createProduct: asyncHandler(async (req, res) => {
    const files = req.files || [];

    // ✅ Upload images if present
    if (files.length > 0) {
      const imageUrls = await Promise.all(
        files.map((file) => uploadFileToS3(file)),
      );
      req.body.imageUrl = imageUrls;
    }

    // ✅ Parse FAQs if coming as string (multipart/form-data)
    if (req.body.faqs && typeof req.body.faqs === "string") {
      req.body.faqs = JSON.parse(req.body.faqs);
    }

    // ✅ Normalize numbers
    if (req.body.sellingPrice !== undefined) {
      req.body.sellingPrice = Number(req.body.sellingPrice);
    }

    if (req.body.mrp !== undefined && req.body.mrp !== "") {
      req.body.mrp = Number(req.body.mrp);
    }

    if (req.body.quantity !== undefined) {
      req.body.quantity = Number(req.body.quantity);
    }

    // 🔐 Validation
    const { error } = createProductValidation(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res,
      );
    }

    const result = await ProductService.createProduct(req.body);
    return successHandler(res, 201, result.message, result.data);
  }),

  /* ---------------- GET ALL PRODUCTS ---------------- */
  getAllProducts: asyncHandler(async (req, res) => {
    const result = await ProductService.getAllProducts(req.query);
    return successHandler(res, 200, result.message, result.data);
  }),

  /* ---------------- GET PRODUCT BY ID ---------------- */
  getProductById: asyncHandler(async (req, res) => {
    const result = await ProductService.getProductById(req.params.id);
    return successHandler(res, 200, result.message, result.data);
  }),

  /* ---------------- UPDATE PRODUCT ---------------- */
  updateProduct: asyncHandler(async (req, res) => {
    const files = req.files || [];

    // ✅ Upload new images (append)
    if (files.length > 0) {
      const imageUrls = await Promise.all(
        files.map((file) => uploadFileToS3(file)),
      );
      req.body.imageUrl = imageUrls; // 👈 array, not single
    }

    // ✅ Parse FAQs if string
    if (req.body.faqs && typeof req.body.faqs === "string") {
      req.body.faqs = JSON.parse(req.body.faqs);
    }

    if (Array.isArray(req.body.faqs)) {
      req.body.faqs = req.body.faqs.map(({ question, answer }) => ({
        question,
        answer,
      }));
    }

    // 🔐 Validation
    const { error } = updateProductValidation(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res,
      );
    }

    const result = await ProductService.updateProduct(req.params.id, req.body);

    return successHandler(res, 200, result.message, result.data);
  }),

  /* ---------------- DELETE PRODUCT ---------------- */
  deleteProduct: asyncHandler(async (req, res) => {
    const result = await ProductService.deleteProduct(req.params.id);
    return successHandler(res, 200, result.message, null);
  }),

  /* ---------------- DELETE PRODUCT IMAGE ---------------- */
  deleteProductImage: asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { imageUrl } = req.body.data;

    const result = await ProductService.deleteProductImage(productId, imageUrl);

    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = productController;
