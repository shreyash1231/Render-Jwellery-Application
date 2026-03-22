const Joi = require("joi");

const contactValidation = (body) => {
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
        message: Joi.string().trim().required().messages({
            "string.empty": "Message is required",
        }),
    });

    return schema.validate(body, { abortEarly: false });
};


const newsLetterValidation = (body) => {
    const schema = Joi.object({

        email: Joi.string().trim().lowercase().email().required().messages({
            "string.empty": "Email is required",
            "string.email": "Invalid email format",
        }),
    });

    return schema.validate(body, { abortEarly: false });
};

module.exports = { contactValidation, newsLetterValidation };
