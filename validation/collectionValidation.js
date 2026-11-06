const Joi = require("joi");
const { PLACEMENTS } = require("../models/collectionModel");

const placementSchema = Joi.string()
  .valid(...PLACEMENTS)
  .messages({ "any.only": "Choose where to show the collection on the homepage" });

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
  "string.pattern.base": "Invalid id",
});

const itemsSchema = Joi.array()
  .items(
    Joi.object({
      category: objectId.required(),
      products: Joi.array().items(objectId).min(1).unique().required().messages({
        "array.min": "Select at least one product in every selected category",
        "array.unique": "A product is selected twice",
      }),
    })
  )
  .min(1)
  .unique("category")
  .messages({
    "array.min": "Select at least one category",
    "array.unique": "A category is selected twice",
  });

const titleSchema = Joi.string().trim().min(2).max(100).messages({
  "string.empty": "Title is required",
  "string.min": "Title must be at least 2 characters",
  "string.max": "Title must be at most 100 characters",
});

const createCollectionValidation = (data) => {
  const schema = Joi.object({
    title: titleSchema.required(),
    items: itemsSchema.required(),
    placement: placementSchema.optional(),
    isActive: Joi.boolean().optional(),
  });
  return schema.validate(data);
};

const updateCollectionValidation = (data) => {
  const schema = Joi.object({
    title: titleSchema.optional(),
    items: itemsSchema.optional(),
    placement: placementSchema.optional(),
    isActive: Joi.boolean().optional(),
  }).min(1);
  return schema.validate(data);
};

module.exports = {
  createCollectionValidation,
  updateCollectionValidation,
};
