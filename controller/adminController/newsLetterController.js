const asyncHandler = require("../../utils/asyncHandler");
const errorResponse = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");
const NewsletterService = require('../../services/newsLetterService');

const newsletterController = {

    getAllNewsletters: asyncHandler(async (req, res, next) => {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
     
        const result = await NewsletterService.getAllNewsletters({}, page, limit);
        return successHandler(res, 200, result.message, result.data);
    }),

    getNewsletterById: asyncHandler(async (req, res, next) => {
        const { id } = req.params;
       
        const result = await NewsletterService.getNewsletterById(id);
        return successHandler(res, 200, result.message, result);
    }),

    deleteNewsletter: asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const result = await NewsletterService.deleteNewsletter(id);
      
        return successHandler(res, 200, result.message, null);
    }),
};

module.exports = newsletterController;
