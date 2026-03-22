const Joi = require("joi");

const addItemSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
});

const updateItemSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  action: Joi.string().valid("increase","decrease").required(),
});

module.exports = {
  addItemSchema,
  updateItemSchema,
};
