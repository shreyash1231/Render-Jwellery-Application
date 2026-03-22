const asyncHandler = require("../../utils/asyncHandler");
const SignatureService = require("../../services/signatureService");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");

const signatureController = {
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
};

module.exports = signatureController;
