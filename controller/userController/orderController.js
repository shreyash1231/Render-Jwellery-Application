const asyncHandler = require("../../utils/asyncHandler");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");
const OrderService = require("../../services/orderService");
const {
  createOrderSchema,
  verifyPaymentSchema,
} = require("../../validation/orderValidation");
const CartService = require("../../services/cartService");
const AddressService = require("../../services/addressService");

const orderController = {
  createOrder: asyncHandler(async (req, res) => {
    const { error, value } = createOrderSchema.validate(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: error.details[0].message },
        req,
        res,
      );
    }
    const userId = req.user?.id || null;
    const result = await OrderService.createOrder(
      userId,
      value.items,
      value.addressId,
      value.shippingAddress,
      value.guestContact,
      value.couponCode,
      value.currency,
    );

    if (!result.success) {
      return errorHandler(
        { statusCode: 400, message: result.message },
        req,
        res,
      );
    }

    return successHandler(res, 201, result.message, result.data);
  }),

  getOrder: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await OrderService.getOrderById(req.params.id);

    if (!result.success) {
      return errorHandler(
        { statusCode: 404, message: result.message },
        req,
        res,
      );
    }

    const order = result.data;
    if (order.userId.toString() !== userId && req.user.role !== "ADMIN") {
      return errorHandler({ statusCode: 403, message: "Forbidden" }, req, res);
    }

    return successHandler(res, 200, result.message, order);
  }),

  getUserOrders: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await OrderService.getUserOrders(userId);
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = orderController;
