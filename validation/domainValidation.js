const Joi = require("joi");

// Validation for creating a domain
const createDomainValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name should have at least 2 characters",
      "string.max": "Name should have at most 100 characters",
    }),

    description: Joi.string().trim().max(500).allow("", null).messages({
      "string.max": "Description should have at most 500 characters",
    }),
    imageUrl: Joi.string()
      .pattern(/^(https?:\/\/.+|uploads\/.+)$/)
      .allow(null)
      .messages({
        "string.pattern.base":
          "Image URL must be a valid CloudFront URL or uploads path",
      }),

    isActive: Joi.boolean().default(true), // default when creating
  }).unknown(false); // ❌ disallow unknown keys

  return schema.validate(body, { abortEarly: false });
};

// Validation for updating a domain (all fields optional)
const updateDomainValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).optional().messages({
      "string.min": "Name should have at least 2 characters",
      "string.max": "Name should have at most 100 characters",
    }),

    description: Joi.string()
      .trim()
      .max(500)
      .allow("", null)
      .optional()
      .messages({
        "string.max": "Description should have at most 500 characters",
      }),

    imageUrl: Joi.string()
      .pattern(/^(https?:\/\/.+|uploads\/.+)$/)
      .allow(null)
      .optional()
      .messages({
        "string.pattern.base":
          "Image URL must be a valid CloudFront URL or uploads path",
      }),

    isActive: Joi.boolean().optional(),
  }).unknown(false); // ❌ disallow unknown keys

  return schema.validate(body, { abortEarly: false });
};

module.exports = {
  createDomainValidation,
  updateDomainValidation,
};
