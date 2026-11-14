const asyncHandler = require("../../utils/asyncHandler");
const discountService = require("../../services/discountService");
const {
  createDiscountValidation,
  updateDiscountValidation,
} = require("../../validation/discountValidation");
const validationError = require("../../utils/validationError");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");

const discountController = {
  createDiscount: asyncHandler(async (req, res) => {
    const { error, value } = createDiscountValidation(req.body);
    if (error) {
      return errorHandler({ statusCode: 400, message: validationError(error) }, req, res);
    }
    const result = await discountService.createDiscount(value);
    return successHandler(res, 201, result.message, result.data);
  }),

  getAllDiscounts: asyncHandler(async (req, res) => {
    const result = await discountService.getAllDiscounts();
    return successHandler(res, 200, result.message, result.data);
  }),

  updateDiscount: asyncHandler(async (req, res) => {
    const { error, value } = updateDiscountValidation(req.body);
    if (error) {
      return errorHandler({ statusCode: 400, message: validationError(error) }, req, res);
    }
    const result = await discountService.updateDiscount(req.params.id, value);
    return successHandler(res, 200, result.message, result.data);
  }),

  deleteDiscount: asyncHandler(async (req, res) => {
    const result = await discountService.deleteDiscount(req.params.id);
    return successHandler(res, 200, result.message, null);
  }),
};

module.exports = discountController;
