// =======================
// validation/user.validation.js
// =======================

const Joi = require('joi');

/**
 * Password Validation Schema
 */
const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
  .required()
  .messages({
    'string.pattern.base':
      'Password must contain at least one uppercase, one lowercase, one number, and one special character',
    'string.empty': 'Password cannot be empty',
    'any.required': 'Password is required',
  });

/**
 * Common validate helper
 */
const validate = (schema, data) => schema.validate(data, { abortEarly: false });

/**
 * Register User Validation
 * (Matches Mongoose User Schema)
 */
const registerUserValidation = (body) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'First name is required',
      'any.required': 'First name is required',
    }),
    lastName: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'Last name is required',
      'any.required': 'Last name is required',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),
    // password optional: signup sends OTP to phone via Twilio, no password at signup
    password: Joi.string().optional(),
    phone: Joi.alternatives().try(Joi.string(), Joi.number()).required().messages({
      'any.required': 'Phone number is required',
    }),
    countryCode: Joi.alternatives().try(Joi.string(), Joi.number()).required().messages({
      'any.required': 'Country code is required',
    }),
  });

  return validate(schema, body);
};

/**
 * Login Validation
 */
const loginUserValidation = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password cannot be empty',
      'any.required': 'Password is required',
    }),
  });

  return validate(schema, body);
};

/**
 * Change Password Validation
 */
const changePasswordValidation = (body) => {
  const schema = Joi.object({
    oldPassword: passwordSchema.label('Old Password'),
    newPassword: passwordSchema.label('New Password'),
    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'Confirm password must match new password',
        'any.required': 'Confirm password is required',
      }),
  });

  return validate(schema, body);
};

/**
 * Send OTP Validation
 */
const sendOtpValidation = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),
  });

  return validate(schema, body);
};

const googleLoginValidation = (body) => {
  const schema = Joi.object({
    idToken: Joi.string().trim().required().messages({
      'string.empty': 'Google ID token is required',
      'any.required': 'Google ID token is required',
    }),
  });

  return validate(schema, body);
};

const updateProfileValidation = (body) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).optional().messages({
      'string.empty': 'First name cannot be empty',
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
    }),

    lastName: Joi.string().min(2).max(50).optional().messages({
      'string.empty': 'Last name cannot be empty',
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
    }),

    image: Joi.string()
      .pattern(/^(https?:\/\/.+|uploads\/.+)$/)
      .allow(null)
      .messages({
        'string.pattern.base':
          'Image URL must be a valid CloudFront URL or uploads path',
      }),
  }).min(1); // at least one field required

  return validate(schema, body);
};

module.exports = {
  registerUserValidation,
  loginUserValidation,
  changePasswordValidation,
  sendOtpValidation,
  googleLoginValidation,
  updateProfileValidation,
};
