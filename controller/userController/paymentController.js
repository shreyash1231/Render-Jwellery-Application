const asyncHandler = require("../../utils/asyncHandler");
const successHandler = require("../../middleware/globalSuccessHandler");
const errorHandler = require("../../middleware/globalErrorHandler");

const paymentService = require("../../services/paymentService");
const {
  createPaymentValidation,
  verifyPaymentValidation,
} = require("../../validation/paymentValidation");

const paymentController = {
  /* ---------- CREATE PAYMENT (ONLINE / COD) ---------- */
  createPayment: asyncHandler(async (req, res) => {
    // 🔐 Joi validation
    const { error } = createPaymentValidation.validate(req.body);
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

    const userId = req.user?.id || null;
    const { orderId } = req.params;
    const { paymentMethod } = req.body;

    const result = await paymentService.createPayment({
      orderId,
      userId,
      paymentMethod,
    });

    return successHandler(res, 201, result.message, result.data);
  }),

  /* ---------- VERIFY PAYMENT (ONLINE ONLY) ---------- */
  verifyPayment: asyncHandler(async (req, res) => {
    // 🔐 Joi validation
    const { error } = verifyPaymentValidation.validate(req.body);
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

    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    const result = await paymentService.verifyPayment({
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      userId: req.user?.id || null,
    });

    return successHandler(res, 200, result.message, result.data);
  }),

  /* ---------- RAZORPAY WEBHOOK ---------- */
  handleWebhook: asyncHandler(async (req, res) => {
    const signature = req.headers["x-razorpay-signature"];
    await paymentService.handleWebhook(req.rawBody, signature);
    res.status(200).json({ received: true });
  }),
};

module.exports = paymentController;
