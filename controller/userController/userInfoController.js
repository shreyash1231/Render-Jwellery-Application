const asyncHandler = require("../../utils/asyncHandler");
const successHandler = require("../../middleware/globalSuccessHandler");
const errorHandler = require("../../middleware/globalErrorHandler");
const validationError = require("../../utils/validationError");
const userInfoService = require("../../services/userInfoService");
const { createUserInfoValidation } = require("../../validation/userInfoValidation");

const userInfoController = {
  createUserInfo: asyncHandler(async (req, res) => {
    const { error, value } = createUserInfoValidation(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res
      );
    }

    const result = await userInfoService.createUserInfo(value);
    return successHandler(res, 201, result.message, result.data);
  }),
};

module.exports = userInfoController;
