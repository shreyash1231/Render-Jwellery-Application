const Joi = require("joi");

/* ---------- CREATE ABOUT US ---------- */
const createAboutUsValidation = (body) => {
  const schema = Joi.object({
    images: Joi.array()
      .items(Joi.string().uri().required())
      .length(3)
      .required()
      .messages({
        "array.base": "Images must be an array",
        "array.length": "Exactly 3 images are required",
        "any.required": "Images are required",
        "string.uri": "Each image must be a valid URL",
      }),
  }).unknown(false);

  return schema.validate(body, { abortEarly: false });
};

/* ---------- UPDATE ABOUT US ---------- */
const updateAboutUsValidation = (body) => {
  const schema = Joi.object({
    images: Joi.array()
      .items(Joi.string().uri().required())
      .length(3)
      .optional()
      .messages({
        "array.base": "Images must be an array",
        "array.length": "Exactly 3 images are required",
        "string.uri": "Each image must be a valid URL",
      }),
  }).unknown(false);

  return schema.validate(body, { abortEarly: false });
};

module.exports = {
  createAboutUsValidation,
  updateAboutUsValidation,
};
