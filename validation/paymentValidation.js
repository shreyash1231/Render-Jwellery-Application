const Joi = require("joi");

/* ---------- GET PAYMENT BY ORDER ID ---------- */
const getPaymentValidation = Joi.object({
  orderId: Joi.string().hex().length(24).required().messages({
    "string.base": "Order ID must be a string",
    "string.hex": "Order ID must be a valid MongoDB ID",
    "string.length": "Order ID must be a valid MongoDB ID",
    "any.required": "Order ID is required",
  }),
}).unknown(false);

/* ---------- CREATE PAYMENT ---------- */
const createPaymentValidation = Joi.object({
  paymentMethod: Joi.string().valid("ONLINE", "COD").required().messages({
    "any.only": "Payment method must be ONLINE or COD",
    "any.required": "Payment method is required",
  }),
}).unknown(false);

/* ---------- VERIFY PAYMENT (ONLINE ONLY) ---------- */
const verifyPaymentValidation = Joi.object({
  orderId: Joi.string().hex().length(24).required(),

  razorpayOrderId: Joi.string().required(),
  razorpayPaymentId: Joi.string().required(),
  razorpaySignature: Joi.string().required(),

 
}).unknown(false);

module.exports = {
  getPaymentValidation,
  createPaymentValidation,
  verifyPaymentValidation,
};
