const asyncHandler = require("../../utils/asyncHandler");
const reviewService = require("../../services/reviewService");
const successHandler = require("../../middleware/globalSuccessHandler");

const reviewController = {
  // ?sort=newest|verified|photos&page=1&limit=5
  getProductReviews: asyncHandler(async (req, res) => {
    const result = await reviewService.getProductReviews(req.params.id, req.query);
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = reviewController;
