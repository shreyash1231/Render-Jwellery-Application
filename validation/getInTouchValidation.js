const Joi = require("joi");

const addressSchema = Joi.object({
    street: Joi.string().trim().required().messages({
        "string.empty": "Street is required",
    }),
    city: Joi.string().trim().required().messages({
        "string.empty": "City is required",
    }),
    state: Joi.string().trim().allow("").optional(),
    country: Joi.string().trim().required().messages({
        "string.empty": "Country is required",
    }),
    zipCode: Joi.string().trim().allow("").optional(),
}).unknown(false);

const socialLinksSchema = Joi.object({
    facebook: Joi.string().uri().trim().allow("").optional(),
    twitter: Joi.string().uri().trim().allow("").optional(),
    instagram: Joi.string().uri().trim().allow("").optional(),
    linkedin: Joi.string().uri().trim().allow("").optional(),
}).unknown(false);


// ✅ Create validation (all required)
const createGetInTouchValidation = (body) => {
    const schema = Joi.object({
        address: addressSchema.required(),
        phone: Joi.string().trim().required().messages({
            "string.empty": "Phone number is required",
        }),
        email: Joi.string().trim().lowercase().email().required().messages({
            "string.empty": "Email is required",
            "string.email": "Invalid email format",
        }),
        socialLinks: socialLinksSchema.optional(),
    }).unknown(false);

    return schema.validate(body, { abortEarly: false });
};


// ✨ Update validation (all optional)
const updateGetInTouchValidation = (body) => {
    const schema = Joi.object({
        address: addressSchema.optional(),
        phone: Joi.string().trim().optional().messages({
            "string.empty": "Phone number cannot be empty",
        }),
        email: Joi.string().trim().lowercase().email().optional().messages({
            "string.email": "Invalid email format",
        }),
        socialLinks: socialLinksSchema.optional(),
    }).unknown(false);

    return schema.validate(body, { abortEarly: false });
};

module.exports = {
    createGetInTouchValidation,
    updateGetInTouchValidation,
};
