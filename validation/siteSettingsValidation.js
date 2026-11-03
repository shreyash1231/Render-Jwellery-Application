const Joi = require("joi");

const updateSiteSettingsValidation = (data) => {
  const schema = Joi.object({
    newFeaturesEnabled: Joi.boolean().optional(),
  }).min(1);

  return schema.validate(data, { abortEarly: false });
};

module.exports = { updateSiteSettingsValidation };
