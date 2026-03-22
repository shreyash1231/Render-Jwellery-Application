const Joi = require("joi");

const createBannerValidation = (body) => {
  const schema = Joi.object({
    imageUrl: Joi.string()
      .required()
      .pattern(/^(https?:\/\/.+|uploads\/.+)$/)
      .messages({
        "string.pattern.base":
          "Image URL must be a valid CloudFront URL or uploads path",
        "any.required": "Image URL is required",
      }),
  }).unknown(false);

  return schema.validate(body, { abortEarly: false });
};

const updateBannerValidation = (body) => {
  const schema = Joi.object({
    imageUrl: Joi.string()
      .optional()
      .pattern(/^(https?:\/\/.+|uploads\/.+)$/)
      .messages({
        "string.pattern.base":
          "Image URL must be a valid CloudFront URL or uploads path",
        "any.required": "Image URL is required",
      }),
  }).unknown(false);

  return schema.validate(body, { abortEarly: false });
};

module.exports = {
  createBannerValidation,
  updateBannerValidation,
};
