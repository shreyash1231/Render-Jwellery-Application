const Joi = require("joi");

const createUserInfoValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 100 characters",
    }),
    email: Joi.string().trim().lowercase().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
    }),
    mobileNumber: Joi.string()
      .trim()
      .pattern(/^\+?[0-9]{10,15}$/)
      .required()
      .messages({
        "string.empty": "Mobile number is required",
        "string.pattern.base":
          "Mobile number must be 10 to 15 digits and may start with +",
      }),
    location: Joi.string().trim().min(2).max(200).required().messages({
      "string.empty": "Location is required",
      "string.min": "Location must be at least 2 characters",
      "string.max": "Location cannot exceed 200 characters",
    }),
  });

  return schema.validate(body, { abortEarly: false });
};

module.exports = { createUserInfoValidation };
