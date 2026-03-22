const asyncHandler = require("../../utils/asyncHandler");
const successHandler = require("../../middleware/globalSuccessHandler");
const testimonialService = require("../../services/testimonialService");


const testimonialController = {

    getAllTestimonials: asyncHandler(async (req, res) => {
        const { page = 1, limit = 10 } = req.query;
       
        const result = await testimonialService.getAllTestimonials(
            {},
            parseInt(page),
            parseInt(limit)
        );
       
        return successHandler(res, 200, result.message, result.data);
    }),

    getTestimonialById: asyncHandler(async (req, res) => {
        const { id } = req.params;
     
         const result = await testimonialService.getTestimonialById(id);
        return successHandler(res, 200, result.message, result.data);
    })
};

module.exports = testimonialController;


