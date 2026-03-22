const Joi = require("joi");

const validate = (schema, data) =>
  schema.validate(data, { abortEarly: false });

const createAddressValidation = (body) => {
  const schema = Joi.object({
    label: Joi.string().max(50).optional(),

    country: Joi.string().required().messages({
      "any.required": "Country is required",
      "string.empty": "Country cannot be empty",
    }),

    firstName: Joi.string().min(2).max(50).required().messages({
      "any.required": "First name is required",
    }),

    lastName: Joi.string().max(50).optional(),

    contactNumber: Joi.string()
      .pattern(/^[0-9]{7,15}$/)
      .required()
      .messages({
        "string.pattern.base": "Invalid contact number",
        "any.required": "Contact number is required",
      }),

    address: Joi.string().required().messages({
      "any.required": "Address is required",
    }),

    apartment: Joi.string().optional(),

    city: Joi.string().required().messages({
      "any.required": "City is required",
    }),

    state: Joi.string().required().messages({
      "any.required": "State is required",
    }),

    pincode: Joi.string()
      .pattern(/^[0-9]{4,10}$/)
      .required()
      .messages({
        "string.pattern.base": "Invalid pincode",
        "any.required": "Pincode is required",
      }),

    isDefault: Joi.boolean().optional(),
  });

  return validate(schema, body);
};

const updateAddressValidation = (body) => {
  const schema = Joi.object({
    label: Joi.string().max(50).optional(),
    country: Joi.string().optional(),
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().max(50).optional(),
    contactNumber: Joi.string()
      .pattern(/^[0-9]{7,15}$/)
      .optional(),
    address: Joi.string().optional(),
    apartment: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    pincode: Joi.string().pattern(/^[0-9]{4,10}$/).optional(),
    isDefault: Joi.boolean().optional(),
  });

  return validate(schema, body);
};

module.exports = {
  createAddressValidation,
  updateAddressValidation,
};
