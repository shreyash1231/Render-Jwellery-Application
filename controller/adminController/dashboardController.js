const DashboardService = require("../../services/dashboardService");
const asyncHandler = require("../../utils/asyncHandler");

const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");

exports.getDashboardStats = asyncHandler(async (req, res) => {
  try {
    // range = 7 | 30 | 90 | 365 days; anything else means all time
    const stats = await DashboardService.getDashboardStats({ range: req.query.range });
    return successHandler(
      res,
      200,
      "Dashboard stats fetched successfully",
      stats,
    );
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return errorHandler({ statusCode: 500, message: "Server Error" }, req, res);
  }
});
