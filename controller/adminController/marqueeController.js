const asyncHandler = require("../../utils/asyncHandler");
const marqueeService = require("../../services/marqueeService");
const { updateMarqueeValidation } = require("../../validation/marqueeValidation");
const validationError = require("../../utils/validationError");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");

const marqueeController = {
  getMarquee: asyncHandler(async (req, res) => {
    const result = await marqueeService.getMarquee();
    return successHandler(res, 200, result.message, result.data);
  }),

  updateMarquee: asyncHandler(async (req, res) => {
    const { error, value } = updateMarqueeValidation(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res
      );
    }

    const result = await marqueeService.updateMarquee(value);
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = marqueeController;
