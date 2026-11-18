const Joi = require("joi");
const { MEDIA_TYPES } = require("../models/reviewModel");

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
  "string.pattern.base": "Invalid id",
});

// Reviews come in as multipart form data, so numbers and booleans arrive as strings
// and Joi converts them.
const fields = {
  product: objectId.messages({ "any.required": "Choose a product" }),
  user: Joi.alternatives().try(objectId, Joi.valid(null, "")).messages({
    "alternatives.match": "Invalid customer",
  }),
  reviewerName: Joi.string().trim().max(60).allow("").messages({
    "string.max": "Reviewer name must be at most 60 characters",
  }),
  rating: Joi.number().integer().min(1).max(5).messages({
    "number.base": "Choose a star rating",
    "number.min": "Rating must be between 1 and 5 stars",
    "number.max": "Rating must be between 1 and 5 stars",
    "any.required": "Choose a star rating",
  }),
  comment: Joi.string().trim().max(3000).allow("").messages({
    "string.max": "Review must be at most 3000 characters",
  }),
  isVerifiedPurchase: Joi.boolean(),
  // A few minutes of slack so a slightly fast admin clock isn't rejected
  reviewedAt: Joi.date()
    .custom((d, helpers) =>
      d.getTime() > Date.now() + 5 * 60 * 1000 ? helpers.message("Review date can't be in the future") : d
    )
    .messages({ "date.base": "Review date is invalid" }),
  isActive: Joi.boolean(),
  // Existing media to keep on update, sent as a JSON string
  keepMedia: Joi.array().items(
    Joi.object({
      type: Joi.string().valid(...MEDIA_TYPES).required(),
      url: Joi.string().required(),
    })
  ),
};

const parseKeepMedia = (data) => {
  if (typeof data.keepMedia === "string") {
    try {
      return { ...data, keepMedia: JSON.parse(data.keepMedia) };
    } catch {
      return { ...data, keepMedia: "invalid" };
    }
  }
  return data;
};

const createReviewValidation = (data) =>
  Joi.object({
    ...fields,
    product: fields.product.required(),
    rating: fields.rating.required(),
  }).validate(parseKeepMedia(data), { abortEarly: false, stripUnknown: true });

const updateReviewValidation = (data) =>
  Joi.object(fields).validate(parseKeepMedia(data), { abortEarly: false, stripUnknown: true });

module.exports = { createReviewValidation, updateReviewValidation };
