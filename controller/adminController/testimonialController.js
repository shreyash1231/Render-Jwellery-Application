const asyncHandler = require("../../utils/asyncHandler");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");
const testimonialService = require("../../services/testimonialService");
const { uploadFileToS3 } = require("../../middleware/uploadFile");
const {
    createTestimonialValidation, updateTestimonialValidation
} = require("../../validation/testimonialValidation");
const validationError = require("../../utils/validationError");

const testimonialController = {

    createTestimonial: asyncHandler(async (req, res) => {
        if (req.file) {
           const imageUrl = await uploadFileToS3(req.file);
            req.body.imageUrl = imageUrl;
        }
        const { error, value } = createTestimonialValidation(req.body);
        if (error) {
            return errorHandler(
                { statusCode: 400, message: validationError(error) },
                req,
                res
            );
        }

        const result = await testimonialService.createTestimonial(value);
        return successHandler(res, 201, result.message, result.data);
    }),

    getAllTestimonials: asyncHandler(async (req, res) => {
        const { page = 1, limit = 10 } = req.query;
       
        const result = await testimonialService.getAllTestimonials(
            {},
            parseInt(page),
          
        );
        return successHandler(res, 200, result.message, result.data);
    }),

    getTestimonialById: asyncHandler(async (req, res) => {
        const { id } = req.params;
      
        const result = await testimonialService.getTestimonialById(id);
        return successHandler(res, 200, result.message, result);
    }),

    updateTestimonial: asyncHandler(async (req, res) => {
        const { id } = req.params;
        if (req.file) {
            const imageUrl = await uploadFileToS3(req.file);
            req.body.imageUrl = imageUrl;
        }

        const { error, value } = updateTestimonialValidation(req.body);
        if (error) {
            return errorHandler(
                { statusCode: 400, message: validationError(error) },
                req,
                res
            );
        }
        const result = await testimonialService.updateTestimonial(id, value);
    
        return successHandler(res, 200, result.message, null);
    }),

    deleteTestimonial: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const result = await testimonialService.deleteTestimonial(id);
      
        return successHandler(res, 200, result.message, null);
    }),
};

module.exports = testimonialController;
