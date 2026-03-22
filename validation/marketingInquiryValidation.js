const Joi = require("joi");

const marketingInquiryValidation = (body) => {
    const schema = Joi.object({
        firstName: Joi.string().trim().required().messages({
            "string.empty": "First name is required",
        }),
        lastName: Joi.string().trim().required().messages({
            "string.empty": "Last name is required",
        }),
        email: Joi.string().trim().lowercase().email().required().messages({
            "string.empty": "Email is required",
            "string.email": "Invalid email format",
        }),
        phone: Joi.string().trim().required().messages({
            "string.empty": "Phone number is required",
        }),
        subject: Joi.string().trim().required().messages({
            "string.empty": "Subject is required",
        }),
        message: Joi.string().trim().required().messages({
            "string.empty": "Message is required",
        }),
        SEO: Joi.boolean().default(false),
        SMO: Joi.boolean().default(false),
    }).custom((value, helpers) => {
        if (!value.SEO && !value.SMO) {
            return helpers.error('custom.atLeastOneService');
        }
        return value;
    }).messages({
        'custom.atLeastOneService': 'At least one of SEO or SMO must be selected',
    });

    return schema.validate(body, { abortEarly: false });
};

module.exports = { marketingInquiryValidation };