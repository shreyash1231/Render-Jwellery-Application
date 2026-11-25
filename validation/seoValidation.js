const Joi = require("joi");
const { SEO_PAGES } = require("../models/seoSettingsModel");

const text = (max) => Joi.string().allow("").trim().max(max);

// Shared by products and categories
const seoFields = {
  slug: Joi.string()
    .allow("")
    .trim()
    .lowercase()
    .max(80)
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .messages({
      "string.pattern.base": "URL slug can only have lowercase letters, numbers and single dashes (e.g. bridal-potli-bag)",
      "string.max": "URL slug can be at most 80 characters",
    }),
  metaTitle: text(70).messages({ "string.max": "Meta title can be at most 70 characters" }),
  metaDescription: text(160).messages({ "string.max": "Meta description can be at most 160 characters" }),
  metaKeywords: text(255).messages({ "string.max": "Meta keywords can be at most 255 characters" }),
};

const tagsField = Joi.array()
  .items(Joi.string().trim().lowercase().min(1).max(40))
  .max(30)
  .messages({ "array.max": "At most 30 tags are allowed", "string.max": "A tag can be at most 40 characters" });

const updateSeoSettingsValidation = (data) => {
  const schema = Joi.object({
    siteUrl: Joi.string()
      .allow("")
      .trim()
      .uri({ scheme: ["http", "https"] })
      .messages({ "string.uri": "Website address must start with https://" }),
    siteName: text(80),
    defaultMetaTitle: seoFields.metaTitle,
    defaultMetaDescription: seoFields.metaDescription,
    defaultMetaKeywords: seoFields.metaKeywords,
    defaultShareImage: text(500),
    pages: Joi.array().items(
      Joi.object({
        key: Joi.string()
          .valid(...SEO_PAGES.map((p) => p.key))
          .required(),
        metaTitle: seoFields.metaTitle,
        metaDescription: seoFields.metaDescription,
        metaKeywords: seoFields.metaKeywords,
      }).unknown(true)
    ),
    robotsTxt: Joi.string().allow("").max(10000),
    headerScripts: Joi.string().allow("").max(50000),
    footerScripts: Joi.string().allow("").max(50000),
  }).min(1);

  return schema.validate(data, { abortEarly: false, stripUnknown: true });
};

module.exports = { seoFields, tagsField, updateSeoSettingsValidation };
