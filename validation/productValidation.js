const Joi = require('joi');

/* ---------- FAQ SCHEMA (REUSABLE) ---------- */
const faqSchema = Joi.object({
  _id: Joi.string().hex().length(24).optional(),

  question: Joi.string().min(5).max(200).required().messages({
    'string.empty': 'FAQ question is required',
  }),

  answer: Joi.string().min(5).max(500).required().messages({
    'string.empty': 'FAQ answer is required',
  }),
});

/* ---------------- CREATE PRODUCT ---------------- */
const createProductValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),

    description: Joi.string().min(10).max(500).required().optional(),

    benefits: Joi.string().min(5).max(500).optional(),

    features: Joi.string().min(5).max(500).optional(),

    use: Joi.string().min(5).max(500).optional(),
    bestSeller: Joi.boolean().optional(),

    additionalInfo: Joi.string().min(5).max(500).optional(),

    mrp: Joi.number().min(0).optional(),

    sellingPrice: Joi.number()
      .min(1)
      .required()
      .custom((value, helpers) => {
        const { mrp } = helpers.state.ancestors[0];
        if (mrp !== undefined && value > mrp) {
          return helpers.message('Selling price cannot be greater than MRP');
        }
        return value;
      }),

    quantity: Joi.number().integer().min(0).required(),

    imageUrl: Joi.array()
      .min(1)
      .required()
      .items(Joi.string().pattern(/^(https?:\/\/.+|uploads\/.+)$/)),

    categoryId: Joi.string().hex().length(24).required(),
    shipmentType: Joi.string().optional(),

    /* ---------- FAQs ---------- */
    faqs: Joi.array().items(faqSchema).max(10).optional().messages({
      'array.base': 'FAQs must be an array',
      'array.max': 'Maximum 10 FAQs are allowed',
    }),
  }).unknown(false);

  return schema.validate(data, { abortEarly: false });
};

/* ---------------- UPDATE PRODUCT ---------------- */
const updateProductValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),

    description: Joi.string().min(10).max(500).optional(),

    benefits: Joi.string().min(5).max(500).optional(),
    bestSeller: Joi.boolean().optional(),

    features: Joi.string().min(5).max(500).optional(),

    use: Joi.string().min(5).max(500).optional(),

    additionalInfo: Joi.string().min(5).max(500).optional(),

    mrp: Joi.number().min(1).optional(),

    sellingPrice: Joi.number()
      .min(1)
      .optional()
      .custom((value, helpers) => {
        const { mrp } = helpers.state.ancestors[0];
        if (mrp !== undefined && value > mrp) {
          return helpers.message('Selling price cannot be greater than MRP');
        }
        return value;
      }),

    quantity: Joi.number().integer().min(0).optional(),

    imageUrl: Joi.array()
      .items(Joi.string().pattern(/^(https?:\/\/.+|uploads\/.+)$/))
      .optional(),

    categoryId: Joi.string().hex().length(24).optional(),

    shipmentType: Joi.string().optional(),

    /* ---------- FAQs ---------- */
    faqs: Joi.array().items(faqSchema).max(10).optional(),
  })
    .min(1)
    .unknown(false);

  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  createProductValidation,
  updateProductValidation,
};
