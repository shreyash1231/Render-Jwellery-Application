const asyncHandler = require("../../utils/asyncHandler");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");

const customOrderService = require("../../services/customOrderService");
const {
  createCustomOrderValidation,
  updateCustomOrderStatusValidation,
} = require("../../validation/customOrderValidation");

const customOrderController = {
  /* ---------- CREATE CUSTOM ORDER ---------- */
  createCustomOrder: asyncHandler(async (req, res) => {
    const { error } = createCustomOrderValidation(req.body);

    if (error) {
      return errorHandler(
        {
          statusCode: 400,
          message: error.details.map((e) => e.message).join(", "),
        },
        req,
        res
      );
    }

    const payload = {
      ...req.body,
      userId: req.user.id,
    };

    const result = await customOrderService.createCustomOrder(payload);

    return successHandler(
      res,
      201,
      "Custom order created successfully",
      result
    );
  }),

  /* ---------- GET MY CUSTOM ORDERS ---------- */
  getMyCustomOrders: asyncHandler(async (req, res) => {
    const result = await customOrderService.getMyCustomOrders(req.user.id);

    return successHandler(
      res,
      200,
      "Custom orders fetched successfully",
      result
    );
  }),

  /* ---------- GET CUSTOM ORDER BY ID ---------- */
  getCustomOrder: asyncHandler(async (req, res) => {
    const order = await customOrderService.getCustomOrderById(req.params.id);

    if (!order) {
      return errorHandler(
        { statusCode: 404, message: "Custom order not found" },
        req,
        res
      );
    }

    // ✅ ownership check (lean-safe)
    if (order.userId.toString() !== req.user.id) {
      return errorHandler(
        {
          statusCode: 403,
          message: "You are not authorized to access this custom order",
        },
        req,
        res
      );
    }

    return successHandler(
      res,
      200,
      "Custom order fetched successfully",
      order
    );
  }),

  /* ---------- ADMIN: UPDATE CUSTOM ORDER STATUS ---------- */
  updateCustomOrderStatus: asyncHandler(async (req, res) => {
    const { error } = updateCustomOrderStatusValidation(req.body);

    if (error) {
      return errorHandler(
        {
          statusCode: 400,
          message: error.details.map((e) => e.message).join(", "),
        },
        req,
        res
      );
    }

    const result = await customOrderService.updateCustomOrderStatus(
      req.params.id,
      req.body.status
    );

    if (!result) {
      return errorHandler(
        { statusCode: 404, message: "Custom order not found" },
        req,
        res
      );
    }

    return successHandler(
      res,
      200,
      "Custom order status updated successfully",
      result
    );
  }),

  /* ---------- ADMIN: DELETE CUSTOM ORDER ---------- */
  deleteCustomOrder: asyncHandler(async (req, res) => {
    const result = await customOrderService.deleteCustomOrder(req.params.id);

    if (!result) {
      return errorHandler(
        { statusCode: 404, message: "Custom order not found" },
        req,
        res
      );
    }

    return successHandler(
      res,
      200,
      "Custom order deleted successfully",
      null
    );
  }),

  /* ---------- ADMIN: GET ALL CUSTOM ORDERS ---------- */
  getAllCustomOrders: asyncHandler(async (req, res) => {
    const { page, limit, status, userId, type } = req.query;

    const result = await customOrderService.getAllCustomOrders({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      status,
      userId,
      type,
    });

    return successHandler(
      res,
      200,
      "Custom orders fetched successfully",
      result
    );
  }),
};

module.exports = customOrderController;
