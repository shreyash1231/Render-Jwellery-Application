const Joi = require("joi");

const createSignatureValidation = (data) => {
  const schema = Joi.object({
    imageUrl: Joi.string()
      .required()
      .pattern(/^(https?:\/\/.+|uploads\/.+)$/)
      .messages({
        "string.pattern.base":
          "Image URL must be a valid CloudFront URL or uploads path",
        "any.required": "Image URL is required",
      }),
    layoutType: Joi.string().valid("tall", "small").required(),
    order: Joi.number().integer().min(1).required(),
  });

  return schema.validate(data, { abortEarly: false });
};

const updateSignatureValidation = (data) => {
  const schema = Joi.object({
    imageUrl: Joi.string()
      .pattern(/^(https?:\/\/.+|uploads\/.+)$/)
      .optional()
      .messages({
        "string.pattern.base":
          "Image URL must be a valid CloudFront URL or uploads path",
      }),
    layoutType: Joi.string().valid("tall", "small").optional(),
    order: Joi.number().integer().min(1).optional(),
  }).min(1);

  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  createSignatureValidation,
  updateSignatureValidation,
};
