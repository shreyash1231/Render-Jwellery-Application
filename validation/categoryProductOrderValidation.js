const Joi = require("joi");

const saveCategoryProductOrderValidation = (data) =>
  Joi.object({
    products: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({ "string.pattern.base": "Invalid product id" }))
      .unique()
      .max(5000)
      .required()
      .messages({ "array.unique": "A product is listed twice" }),
  }).validate(data);

module.exports = { saveCategoryProductOrderValidation };
