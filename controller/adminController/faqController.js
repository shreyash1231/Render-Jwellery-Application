const asyncHandler = require("../../utils/asyncHandler");
const faqService = require("../../services/faqService");
const FAQ = require("../../models/faqModel");
const {
  createFaqValidation,
  updateFaqValidation,
} = require("../../validation/faqValidation");
const validationError = require("../../utils/validationError");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");

const faqController = {
  createFAQ: asyncHandler(async (req, res) => {
    const { error, value } = createFaqValidation(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res,
      );
    }

    const result = await faqService.createFAQ(value);

    return successHandler(res, 201, result.message);
  }),

  getAllFAQ: asyncHandler(async (req, res) => {
    const result = await faqService.getAllFAQ();

    return successHandler(res, 200, result.message, result.data);
  }),

  getByIdFAQ: asyncHandler(async (req, res) => {
    const result = await faqService.getByIdFAQ(req.params.id);

    return successHandler(res, 200, result.message, result.data);
  }),

  updateFAQ: asyncHandler(async (req, res) => {
    const { error, value } = updateFaqValidation(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res,
      );
    }

    const result = await faqService.updateFAQ(req.params.id, value);

    return successHandler(res, 200, result.message, null);
  }),

  deleteFAQ: asyncHandler(async (req, res) => {
    const result = await faqService.deleteFAQ(req.params.id);

    return successHandler(res, 200, result.message, null);
  }),
};

module.exports = faqController;
