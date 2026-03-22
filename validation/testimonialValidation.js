const Joi = require("joi");

const createTestimonialValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().trim().required().messages({
      "string.base": "Name must be a string",
      "string.empty": "Name is required",
      "any.required": "Name is required",
    }),

    country: Joi.string().trim().required().messages({
      "string.base": "Country must be a string",
      "string.empty": "Country is required",
      "any.required": "Country is required",
    }),

    message: Joi.string().trim().required().messages({
      "string.base": "Message must be a string",
      "string.empty": "Message is required",
      "any.required": "Message is required",
    }),

    imageUrl: Joi.string().uri().required().allow("").messages({
      "string.uri": "Image URL must be a valid URI",
    }),
  }).unknown(false);
  return schema.validate(body, { abortEarly: false });
};

const updateTestimonialValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().trim().optional().messages({
      "string.base": "Name must be a string",
      "string.empty": "Name cannot be empty",
    }),

    country: Joi.string().trim().optional().messages({
      "string.base": "Country must be a string",
      "string.empty": "Country cannot be empty",
    }),

    message: Joi.string().trim().optional().messages({
      "string.base": "Message must be a string",
      "string.empty": "Message cannot be empty",
    }),

    imageUrl: Joi.string().uri().optional().allow("").messages({
      "string.uri": "Image URL must be a valid URI",
    }),
  }).unknown(false);

  return schema.validate(body, { abortEarly: false });
};

module.exports = {
  createTestimonialValidation,
  updateTestimonialValidation,
};
