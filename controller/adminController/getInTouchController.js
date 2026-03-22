const asyncHandler = require("../../utils/asyncHandler");
const getInTouchService = require("../../services/getInTouchService");
const successHandler = require("../../middleware/globalSuccessHandler");
const errorHandler = require("../../middleware/globalErrorHandler");
const {
  updateGetInTouchValidation,
  createGetInTouchValidation,
} = require("../../validation/getInTouchValidation");
const validationError = require("../../utils/validationError");

const getInTouchController = {
  createGetInTouch: asyncHandler(async (req, res) => {
    const { error, value } = createGetInTouchValidation(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res,
      );
    }
    const result = await getInTouchService.createGetInTouch(value);

    return successHandler(res, 200, result.message, result.data);
  }),

  get: asyncHandler(async (req, res) => {
    const result = await getInTouchService.get();
    if (!result || !result.data) {
      return errorHandler(
        { statusCode: 404, message: "GetInTouch entry not found" },
        req,
        res,
      );
    }
    return successHandler(res, 200, result.message, result.data);
  }),

  updateGetInTouch: asyncHandler(async (req, res) => {
    const { error, value } = updateGetInTouchValidation(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res,
      );
    }
    const result = await getInTouchService.updateGetInTouch(
      req.params.id,
      value,
    );
    if (!result || !result.data) {
      return errorHandler(
        { statusCode: 404, message: "GetInTouch entry not found" },
        req,
        res,
      );
    }

    return successHandler(res, 200, result.message, null);
  }),

  deleteGetInTouch: asyncHandler(async (req, res) => {
    const result = await getInTouchService.deleteGetInTouch(req.params.id);
    if (!result) {
      return errorHandler(
        { statusCode: 404, message: "GetInTouch entry not found" },
        req,
        res,
      );
    }

    return successHandler(res, 200, result.message, null);
  }),
};

module.exports = getInTouchController;
