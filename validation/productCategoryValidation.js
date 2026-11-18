const Joi = require("joi");

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
  "string.pattern.base": "Invalid id",
});

// The full list of extra categories for one product; anything not listed is removed
const saveProductCategoriesValidation = (data) =>
  Joi.object({
    product: objectId.required().messages({ "any.required": "Choose a product" }),
    categories: Joi.array()
      .items(
        Joi.object({
          category: objectId.required(),
          isActive: Joi.boolean().default(true),
        })
      )
      .max(200)
      .required()
      .messages({ "any.required": "Choose at least one category" }),
  }).validate(data, { abortEarly: false, stripUnknown: true });

const statusValidation = (data) =>
  Joi.object({
    isActive: Joi.boolean().required().messages({ "any.required": "Status is required" }),
  }).validate(data, { abortEarly: false, stripUnknown: true });

module.exports = { saveProductCategoriesValidation, statusValidation };
