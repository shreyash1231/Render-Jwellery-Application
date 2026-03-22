const asyncHandler = require("../../utils/asyncHandler");
const successHandler = require("../../middleware/globalSuccessHandler");
const userInfoService = require("../../services/userInfoService");

const userInfoController = {
  getAllUserInfo: asyncHandler(async (req, res) => {
    const result = await userInfoService.getAllUserInfo();
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = userInfoController;
