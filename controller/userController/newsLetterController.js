const asyncHandler = require("../../utils/asyncHandler");
const successHandler = require("../../middleware/globalSuccessHandler");
const NewsletterService = require('../../services/newsLetterService');
const validationError = require("../../utils/validationError");
const {newsLetterValidation} = require("../../validation/contactValidation");
const errorHandler=require("../../middleware/globalErrorHandler");

const newsletterController = {

    createNewsletter: asyncHandler(async (req, res, next) => {
        const { error, value } = newsLetterValidation(req.body);
        if (error) {
            return errorHandler(
                { statusCode: 400, message: validationError(error) },
                req,
                res
            );
        }
        const result = await NewsletterService.createNewsletter(value);
        return successHandler(res, 201, result.message, result);
    }),
};

module.exports = newsletterController;
