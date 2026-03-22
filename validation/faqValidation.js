const Joi = require("joi");

// Validation for creating FAQ
const createFaqValidation = (body) => {
    const schema = Joi.object({
        question: Joi.string()
            .trim()
            .max(300)
            .required()
            .messages({
                "string.empty": "Question is required",
                "any.required": "Question is required",
                "string.max": "Question cannot exceed 300 characters",
            }),

        answer: Joi.string()
            .trim()
            .max(300)
            .required()
            .messages({
                "string.empty": "Answer is required",
                "any.required": "Answer is required",
                "string.max": "Answer cannot exceed 300 characters",
            }),

        isActive: Joi.boolean()
            .optional()
            .messages({
                "boolean.base": "isActive must be true or false",
            }),
    }).unknown(false); // disallow extra keys

    return schema.validate(body, { abortEarly: false });
};


// Validation for updating FAQ (all fields optional)
const updateFaqValidation = (body) => {
    const schema = Joi.object({
        question: Joi.string()
            .trim()
            .max(300)
            .messages({
                "string.max": "Question cannot exceed 300 characters",
            }),

        answer: Joi.string()
            .trim()
            .max(300)
            .messages({
                "string.max": "Answer cannot exceed 300 characters",
            }),

        isActive: Joi.boolean().optional(),
    }).unknown(false); // disallow extra keys

    return schema.validate(body, { abortEarly: false });
};

module.exports = {
    createFaqValidation,
    updateFaqValidation,
};
