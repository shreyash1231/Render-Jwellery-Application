const Joi = require("joi");

/**
 * Common validator helper
 */
const validate = (schema, data) => schema.validate(data, { abortEarly: false });

/**
 */
const createReelValidation = (body) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(2).max(100).required().messages({
      "string.empty": "Title is required",
      "any.required": "Title is required",
    }),

    videoUrl: Joi.string()
      .required()
      .pattern(/^(https?:\/\/.+|uploads\/.+)$/)
      .messages({
        "string.pattern.base": "Video URL must be a valid URL or uploads path",
        "string.empty": "Video URL is required",
        "any.required": "Video URL is required",
      }),
    imageUrl: Joi.string()
      .optional()
      .pattern(/^(https?:\/\/.+|uploads\/.+)$/)
      .messages({
        "string.pattern.base":
          "Image URL must be a valid CloudFront URL or uploads path",
        "string.empty": "Image URL is required",
        "any.required": "Image URL is required",
      }),
  });

  return validate(schema, body);
};

/**
 * Update Reel Validation (partial update)
 */
const updateReelValidation = (body) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(2).max(100),
    price: Joi.number().positive().optional(),
    videoUrl: Joi.string()
      .required()
      .pattern(/^(https?:\/\/.+|uploads\/.+)$/)
      .messages({
        "string.pattern.base": "Video URL must be a valid URL or uploads path",
        "string.empty": "Video URL is required",
        "any.required": "Video URL is required",
      }),
    imageUrl: Joi.string()
      .pattern(/^(https?:\/\/.+|uploads\/.+)$/)
      .optional()
      .messages({
        "string.pattern.base":
          "Image URL must be a valid CloudFront URL or uploads path",
      }),
  }).min(1);

  return validate(schema, body);
};

module.exports = {
  createReelValidation,
  updateReelValidation,
};
