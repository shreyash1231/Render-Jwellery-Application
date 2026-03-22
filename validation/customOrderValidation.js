const Joi = require("joi");

/* ---------- CREATE CUSTOM ORDER ---------- */
const createCustomOrderValidation = (data) => {
  const schema = Joi.object({
    type: Joi.string()
      .valid("BULK", "BRIDESMAID", "BESTMAN", "SINGLE")
      .required()
      .messages({
        "any.only": "Type must be BULK, BRIDESMAID, BESTMAN or SINGLE",
        "any.required": "Type is required",
      }),

    address: Joi.string().min(5).required().messages({
      "string.empty": "Address is required",
    }),

    date: Joi.date().iso().required().messages({
      "date.base": "Date must be a valid ISO date",
      "any.required": "Date is required",
    }),
  }).unknown(false);

  return schema.validate(data, { abortEarly: false });
};

/* ---------- UPDATE STATUS (ADMIN) ---------- */
const updateCustomOrderStatusValidation = (data) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid("PENDING", "CONFIRMED", "COMPLETED", "CANCELLED")
      .required(),
  }).unknown(false);

  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  createCustomOrderValidation,
  updateCustomOrderStatusValidation,
};
