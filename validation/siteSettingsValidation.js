const Joi = require("joi");
const { DELIVERY_DAYS_TYPES } = require("../models/siteSettingsModel");

const days = (label) =>
  Joi.number().integer().min(0).max(90).messages({
    "number.base": `${label} must be a number`,
    "number.integer": `${label} must be a whole number`,
    "number.min": `${label} can't be negative`,
    "number.max": `${label} can be at most 90`,
  });

const updateSiteSettingsValidation = (data) => {
  const schema = Joi.object({
    newFeaturesEnabled: Joi.boolean().optional(),
    deliveryCharge: Joi.number().min(0).max(100000).messages({
      "number.base": "Delivery charge must be a number",
      "number.min": "Delivery charge can't be negative",
    }),
    freeDeliveryAbove: Joi.number().min(0).max(10000000).messages({
      "number.base": "Free delivery amount must be a number",
      "number.min": "Free delivery amount can't be negative",
    }),
    deliveryDaysType: Joi.string().valid(...DELIVERY_DAYS_TYPES),
    deliveryDaysMin: days("Delivery days"),
    deliveryDaysMax: days("Latest delivery days"),
  })
    .min(1)
    .custom((value, helpers) => {
      if (
        value.deliveryDaysType === "range" &&
        value.deliveryDaysMin !== undefined &&
        value.deliveryDaysMax !== undefined &&
        value.deliveryDaysMax < value.deliveryDaysMin
      ) {
        return helpers.message("Latest delivery days must be the same as or more than the earliest");
      }
      return value;
    });

  return schema.validate(data, { abortEarly: false });
};

module.exports = { updateSiteSettingsValidation };
