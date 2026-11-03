const asyncHandler = require("../../utils/asyncHandler");
const marqueeService = require("../../services/marqueeService");
const successHandler = require("../../middleware/globalSuccessHandler");

const marqueeController = {
  getMarquee: asyncHandler(async (req, res) => {
    const result = await marqueeService.getMarquee();
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = marqueeController;
