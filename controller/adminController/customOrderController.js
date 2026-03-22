const asyncHandler = require("../../utils/asyncHandler");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");

const customOrderService = require("../../services/customOrderService");
const {
  updateCustomOrderStatusValidation,
} = require("../../validation/customOrderValidation");

const customOrderController = {
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
        {
          statusCode: 404,
          message: "Custom order not found",
        },
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
        {
          statusCode: 404,
          message: "Custom order not found",
        },
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
};

module.exports = customOrderController;
