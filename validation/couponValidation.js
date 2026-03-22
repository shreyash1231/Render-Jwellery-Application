const Joi = require("joi");

/* ======================================================
   CREATE COUPON
   ====================================================== */
const createCouponValidation = (data) => {
  const schema = Joi.object({
    code: Joi.string()
      .trim()
      .uppercase()
      .min(3)
      .max(20)
      .required(),

    type: Joi.string()
      .valid("PERCENT", "AMOUNT")
      .required(),

    value: Joi.number()
      .min(1)
      .when("type", {
        is: "PERCENT",
        then: Joi.number().max(100), // ✅ FIXED
        otherwise: Joi.number().required(),
      })
      .required(),

    maxDiscount: Joi.number()
      .min(1)
      .when("type", {
        is: "PERCENT",
        then: Joi.number().required(),
        otherwise: Joi.forbidden(),
      }),

    minOrderValue: Joi.number()
      .min(0)
      .default(0),

    expiresAt: Joi.custom((value, helpers) => {
      if (value === null || value === undefined) {
        return value;
      }
      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) {
        return helpers.error("date.base");
      }
      const now = new Date();
      if (date <= now) {
        return helpers.error("date.greater", { limit: "now" });
      }
      return date;
    })
      .allow(null)
      .optional(),

    usageLimit: Joi.number()
      .integer()
      .min(1)
      .optional()
      .allow(null),

    perUserLimit: Joi.number()
      .integer()
      .min(1)
      .default(1),

    isActive: Joi.boolean()
      .default(true),
  })
    .strict()        // ✅ NO extra keys allowed
    .unknown(false); // ✅ HARD reject unknown fields

  return schema.validate(data, { abortEarly: false });
};

/* ======================================================
   UPDATE COUPON
   ====================================================== */
const updateCouponValidation = (data) => {
  const schema = Joi.object({
    code: Joi.string()
      .trim()
      .uppercase()
      .min(3)
      .max(20)
      .optional(),

    type: Joi.string()
      .valid("PERCENT", "AMOUNT")
      .optional(),

    value: Joi.number()
      .min(1)
      .when("type", {
        is: "PERCENT",
        then: Joi.number().max(100), // ✅ FIXED
        otherwise: Joi.number().optional(),
      })
      .optional(),

    maxDiscount: Joi.number()
      .min(1)
      .when("type", {
        is: "PERCENT",
        then: Joi.number().required(),
        otherwise: Joi.forbidden(),
      })
      .optional(),

    minOrderValue: Joi.number()
      .min(0)
      .optional(),

    expiresAt: Joi.custom((value, helpers) => {
      if (value === null || value === undefined) {
        return value;
      }
      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) {
        return helpers.error("date.base");
      }
      const now = new Date();
      if (date <= now) {
        return helpers.error("date.greater", { limit: "now" });
      }
      return date;
    })
      .allow(null)
      .optional(),

    usageLimit: Joi.number()
      .integer()
      .min(1)
      .optional()
      .allow(null),

    perUserLimit: Joi.number()
      .integer()
      .min(1)
      .optional(),

    isActive: Joi.boolean()
      .optional(),
  })
    .min(1)
    .strict()
    .unknown(false);

  return schema.validate(data, { abortEarly: false });
};

/* ======================================================
   APPLY COUPON
   ====================================================== */
const applyCouponValidation = (data) => {
  const schema = Joi.object({
    code: Joi.string()
      .trim()
      .uppercase()
      .required(),

    // amount = cart total BEFORE coupon
    amount: Joi.number()
      .min(1)
      .required(),
  })
    .strict()
    .unknown(false);

  return schema.validate(data, { abortEarly: false });
};

/* ======================================================
   EXPORTS
   ====================================================== */
module.exports = {
  createCouponValidation,
  updateCouponValidation,
  applyCouponValidation,
};
