const Joi = require("joi");

const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
  .required()
  .messages({
    "string.pattern.base":
      "Password must contain at least one uppercase, one lowercase, one number, and one special character",
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  });

const validate = (schema, data) => schema.validate(data, { abortEarly: false });

const registerUserValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: passwordSchema,
  });

  return validate(schema, body);
};

const loginUserValidation = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
    }),
  });

  return validate(schema, body);
};

const changePasswordValidation = (body) => {
  const schema = Joi.object({
    oldPassword: passwordSchema.label("Old Password"),
    newPassword: passwordSchema.label("New Password"),
    confirmPassword: Joi.any()
      .valid(Joi.ref("newPassword"))
      .required()
      .messages({
        "any.only": "Confirm password must match new password",
        "any.required": "Confirm Password is required",
      }),
  });

  return validate(schema, body);
};



const sendOtpValidation = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
  });

  return validate(schema, body);
};


module.exports = {
  registerUserValidation,
  loginUserValidation,
  changePasswordValidation,
  sendOtpValidation
};
