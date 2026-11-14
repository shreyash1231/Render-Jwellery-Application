const Joi = require("joi");
const { SCOPES, TYPES } = require("../models/discountModel");

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
  "string.pattern.base": "Invalid id",
});

const fields = {
  title: Joi.string().trim().min(2).max(100).messages({
    "string.empty": "Offer name is required",
    "string.min": "Offer name must be at least 2 characters",
    "string.max": "Offer name must be at most 100 characters",
  }),
  category: objectId.messages({ "any.required": "Choose a category" }),
  scope: Joi.string().valid(...SCOPES),
  products: Joi.array()
    .items(
      Joi.object({
        product: objectId.required(),
        isActive: Joi.boolean().default(true),
      })
    )
    .unique("product")
    .messages({ "array.unique": "A product is selected twice" }),
  type: Joi.string().valid(...TYPES).messages({ "any.only": "Choose percentage or flat amount" }),
  value: Joi.number().positive().messages({
    "number.base": "Discount value must be a number",
    "number.positive": "Discount value must be more than 0",
  }),
  startDate: Joi.date().messages({ "date.base": "Start date is invalid" }),
  endDate: Joi.date().messages({ "date.base": "End date is invalid" }),
  isActive: Joi.boolean(),
};

// Rules that need several fields together; on update they are checked again by the service
// against the saved document, so here they only run when the fields are sent together.
const crossChecks = (value, helpers) => {
  if (value.type === "percentage" && value.value !== undefined && value.value >= 100) {
    return helpers.message("Percentage must be less than 100");
  }
  if (value.startDate && value.endDate && new Date(value.endDate) < new Date(value.startDate)) {
    return helpers.message("End date must be on or after the start date");
  }
  if (value.scope === "products" && Array.isArray(value.products) && !value.products.length) {
    return helpers.message("Select at least one product");
  }
  return value;
};

const createDiscountValidation = (data) =>
  Joi.object({
    title: fields.title.required(),
    category: fields.category.required(),
    scope: fields.scope.default("category"),
    products: fields.products.default([]),
    type: fields.type.required(),
    value: fields.value.required(),
    startDate: fields.startDate.required(),
    endDate: fields.endDate.required(),
    isActive: fields.isActive.default(true),
  })
    .custom(crossChecks)
    .validate(data);

const updateDiscountValidation = (data) =>
  Joi.object(fields).min(1).custom(crossChecks).validate(data);

module.exports = { createDiscountValidation, updateDiscountValidation };
