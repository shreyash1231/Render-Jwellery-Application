const asyncHandler = require("../../utils/asyncHandler");
const StaticContentService = require("../../services/contentService");
const { createContentValidation, updateContentValidation } = require("../../validation/contentValidation");
const validationError = require("../../utils/validationError");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");


const staticContentController = {

    createStaticContent: asyncHandler(async (req, res) => {
        const { error, value } = createContentValidation(req.body);
        if (error) {
            return errorHandler(
                { statusCode: 400, message: validationError(error) },
                req,
                res
            );
        }

        const result = await StaticContentService.createStaticContent(value);
      
        return successHandler(res, 201, result.message, result.data);
    }),

    getAllStaticContents: asyncHandler(async (req, res) => {
      
        const result = await StaticContentService.getAllStaticContents();
        return successHandler(res, 200, result.message, result.data);
    }),

    getStaticContentById: asyncHandler(async (req, res) => {
        const { id } = req.params;
       
        const result = await StaticContentService.getStaticContentById(id);
        return successHandler(res, 200, result.message, result.data);
    }),

    updateStaticContent: asyncHandler(async (req, res) => {
        const { id } = req.params;

        const { error, value } = updateContentValidation(req.body);
        if (error) {
            return errorHandler(
                { statusCode: 400, message: validationError(error) },
                req,
                res
            );
        }

        const result = await StaticContentService.updateStaticContent(id, value);
      
        return successHandler(res, 200, result.message, null);
    }),

    deleteStaticContent: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const result = await StaticContentService.deleteStaticContent(id);
       
        return successHandler(res, 200, result.message, result.data, null);
    }),

    toggleStatus: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const result = await StaticContentService.toggleStatus(id);
     
        return successHandler(res, 200, result.message, result.data);
    }),

    getStaticContentByType: asyncHandler(async (req, res) => {
        const { type } = req.params;
   
        const result = await StaticContentService.getStaticContentByType(type);
        return successHandler(res, 200, result.message, result.data);
    }),

};

module.exports = staticContentController;
