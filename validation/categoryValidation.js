const joi = require("joi");

const createCategoryValidation = (data) => {
  const schema = joi.object({
    name: joi.string().min(2).max(100).required(),
    description: joi.string().min(2).max(150).required(),
    imageUrl: joi.string()
      .optional()
      .pattern(/^(https?:\/\/.+|uploads\/.+)$/)
      .messages({
        "string.pattern.base":
          "Image URL must be a valid CloudFront URL or uploads path",
        "any.required": "Image URL is required",
      }),
    logo: joi.string()
      .optional()
      .pattern(/^(https?:\/\/.+|uploads\/.+)$/)
      .messages({
        "string.pattern.base":
          "Logo must be a valid URL or uploads path",
      }),
              isShopByProduct:joi.boolean().optional(),

  });
  return schema.validate(data);
};

const updateCategoryValidation = (data) => {
  const schema = joi
    .object({
      name: joi.string().min(2).max(100).optional(),
      description: joi.string().min(2).max(150).optional(),
      imageUrl: joi.string()
        .optional()
        .pattern(/^(https?:\/\/.+|uploads\/.+)$/)
        .messages({
          "string.pattern.base":
            "Image URL must be a valid CloudFront URL or uploads path",
          "any.required": "Image URL is required",
        }),
      logo: joi.string()
        .optional()
        .pattern(/^(https?:\/\/.+|uploads\/.+)$/)
        .messages({
          "string.pattern.base":
            "Logo must be a valid URL or uploads path",
        }),
        isShopByProduct:joi.boolean().optional(),
    })
    .min(1);
  return schema.validate(data);
};

module.exports = {
  createCategoryValidation,
  updateCategoryValidation,
};
