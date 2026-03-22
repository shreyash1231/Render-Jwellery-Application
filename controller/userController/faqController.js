const asyncHandler = require("../../utils/asyncHandler");
const faqService = require("../../services/faqService");
const FAQ = require("../../models/faqModel");
const successHandler = require("../../middleware/globalSuccessHandler");

const faqController = {
  getAllFAQ: asyncHandler(async (req, res) => {
   

    const result = await faqService.getAllFAQ();

    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = faqController;
