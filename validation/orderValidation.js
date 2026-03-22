const Joi = require("joi");

const shippingSchema = Joi.object({
  country: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().allow("", null),
  contactNumber: Joi.string()
    .pattern(/^[0-9+\- ]{7,20}$/)
    .required(),
  address: Joi.string().required(),
  apartment: Joi.string().allow("", null),
  city: Joi.string().required(),
  state: Joi.string().required(),
  pincode: Joi.string().required(),
});

const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().hex().length(24).required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),

  addressId: Joi.string().hex().length(24).optional(),

  shippingAddress: shippingSchema.optional(),

  guestContact: Joi.object({
    email: Joi.string().email().allow("", null).optional(),
  }).optional(),

  couponCode: Joi.string().trim().optional(),

  currency: Joi.string().valid("INR").default("INR"),
}).custom((value, helpers) => {
  if (!value.addressId && !value.shippingAddress) {
    return helpers.error("any.custom", {
      message: "Either addressId or shippingAddress is required",
    });
  }

  return value;
}, "address validation").messages({
  "any.custom": "Either addressId or shippingAddress is required",
});

const verifyPaymentSchema = Joi.object({
  orderId: Joi.string().required(),
  razorpayPaymentId: Joi.string().required(),
  razorpaySignature: Joi.string().required(),
});

module.exports = {
  createOrderSchema,
  verifyPaymentSchema,
};
