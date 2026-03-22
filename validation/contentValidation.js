const Joi = require("joi");

// Validation for creating content
const createContentValidation = (body) => {
    const schema = Joi.object({
        type: Joi.string()
            .valid("PRIVACY_POLICY", "TERMS_AND_CONDITIONS", "ABOUT_US","EXCHANGE_POLICY","SHIPPING_POLICY")
            .required()
            .messages({
                "any.required": "Type is required",
                "any.only": "Not a valid type",
            }),

        title: Joi.string()
            .required()
            .messages({
                "any.required": "Title is required",
            }),

        content: Joi.string()
            .required()
            .messages({
                "any.required": "Content is required",
            }),

        isActive: Joi.boolean().default(true),
    }).unknown(false); 

    return schema.validate(body, { abortEarly: false });
};


// Validation for updating content (partial update allowed)
const updateContentValidation = (body) => {
    const schema = Joi.object({


        title: Joi.string().optional(),

        content: Joi.string().optional(),

        isActive: Joi.boolean().optional(),
    }).unknown(false); // disallow extra keys

    return schema.validate(body, { abortEarly: false });
};


module.exports = {
    createContentValidation,
    updateContentValidation,
};
