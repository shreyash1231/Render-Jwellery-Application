const asyncHandler = require("../../utils/asyncHandler");
const successHandler = require("../../middleware/globalSuccessHandler");
const errorHandler = require("../../middleware/globalErrorHandler");

const PaymentService = require("../../services/paymentService");
const {
  getPaymentValidation,
} = require("../../validation/paymentValidation");

const paymentController = {
  /* ---------- ADMIN: GET ALL PAYMENTS ---------- */
  getAllPayments: asyncHandler(async (req, res) => {
    const result = await PaymentService.getAllPayments();
    return successHandler(res, 200, result.message, result.data);
  }),

  /* ---------- GET PAYMENT BY ORDER ID ---------- */
  getPaymentByOrderId: asyncHandler(async (req, res) => {
    // 🔐 Joi validation
    const { error } = getPaymentValidation.validate(req.params);
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

    const { orderId } = req.params;

    const result = await PaymentService.getPaymentByOrderId(orderId);

    if (!result.success) {
      return errorHandler(
        { statusCode: 404, message: result.message },
        req,
        res
      );
    }

    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = paymentController;
