const asyncHandler = require("../../utils/asyncHandler");
const SignatureService = require("../../services/signatureService");
const {
  createSignatureValidation,
  updateSignatureValidation,
} = require("../../validation/signatureValidation");
const validationError = require("../../utils/validationError");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");
const { uploadFileToS3 } = require("../../middleware/uploadFile");

const signatureController = {
  createSignature: asyncHandler(async (req, res) => {
    // Handle image upload
    if (req.file) {
      const imageUrl = await uploadFileToS3(req.file);
      req.body.imageUrl = imageUrl;
    }

    const { error, value } = createSignatureValidation(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res
      );
    }

    const result = await SignatureService.createSignature(value);
    return successHandler(res, 201, result.message, result.data);
  }),

  getAllSignatures: asyncHandler(async (req, res) => {
    const result = await SignatureService.getAllSignatures();
    return successHandler(res, 200, result.message, result.data);
  }),

  getSignatureById: asyncHandler(async (req, res) => {
    const result = await SignatureService.getSignatureById(req.params.id);

    if (!result.data) {
      return errorHandler(
        { statusCode: 404, message: "Signature not found" },
        req,
        res
      );
    }

    return successHandler(res, 200, result.message, result.data);
  }),

  updateSignature: asyncHandler(async (req, res) => {
    // Handle image upload if provided
    if (req.file) {
      const imageUrl = await uploadFileToS3(req.file);
      req.body.imageUrl = imageUrl;
    }

    const { error, value } = updateSignatureValidation(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res
      );
    }

    const result = await SignatureService.updateSignature(req.params.id, value);
    return successHandler(res, 200, result.message, result.data);
  }),

  deleteSignature: asyncHandler(async (req, res) => {
    const result = await SignatureService.deleteSignature(req.params.id);
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = signatureController;
