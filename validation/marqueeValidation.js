const Joi = require("joi");

const hexColor = Joi.string()
  .pattern(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
  .messages({ "string.pattern.base": "{#label} must be a hex color like #2a2016" });

const updateMarqueeValidation = (data) => {
  const schema = Joi.object({
    messages: Joi.array()
      .items(Joi.string().trim().min(1).max(300))
      .max(20)
      .optional(),
    textColor: hexColor.optional(),
    backgroundColor: hexColor.optional(),
    speed: Joi.number().integer().min(5).max(120).optional(),
    isActive: Joi.boolean().optional(),
  }).min(1);

  return schema.validate(data, { abortEarly: false });
};

module.exports = { updateMarqueeValidation };
