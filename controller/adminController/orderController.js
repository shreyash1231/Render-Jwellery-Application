const asyncHandler = require("../../utils/asyncHandler");
const OrderService = require("../../services/orderService");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");

const orderController = {
  getAllOrders: asyncHandler(async (req, res) => {
    const result = await OrderService.getAllOrders();
    return successHandler(res, 200, result.message, result.data);
  }),

  getOrderById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await OrderService.getOrderById(id);
    if (!result.success) {
      return errorHandler(
        { statusCode: 404, message: result.message },
        req,
        res
      );
    }
    return successHandler(res, 200, "Order fetched successfully", result.data);
  }),

  updateOrderStatus: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { orderStatus, note } = req.body;
    const status = orderStatus;

    if (!status) {
      return errorHandler(
        { statusCode: 400, message: "Status is required" },
        req,
        res
      );
    }

    const result = await OrderService.updateOrderStatus(id, status, note);
    if (!result.success) {
      return errorHandler(
        { statusCode: 400, message: result.message },
        req,
        res
      );
    }
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = orderController;
