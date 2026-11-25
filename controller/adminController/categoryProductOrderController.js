const asyncHandler = require("../../utils/asyncHandler");
const categoryProductOrderService = require("../../services/categoryProductOrderService");
const { saveCategoryProductOrderValidation } = require("../../validation/categoryProductOrderValidation");
const validationError = require("../../utils/validationError");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");

const categoryProductOrderController = {
  getOrder: asyncHandler(async (req, res) => {
    const result = await categoryProductOrderService.getOrder(req.params.categoryId);
    return successHandler(res, 200, result.message, result.data);
  }),

  saveOrder: asyncHandler(async (req, res) => {
    const { error, value } = saveCategoryProductOrderValidation(req.body);
    if (error) {
      return errorHandler({ statusCode: 400, message: validationError(error) }, req, res);
    }
    const result = await categoryProductOrderService.saveOrder(req.params.categoryId, value.products);
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = categoryProductOrderController;
