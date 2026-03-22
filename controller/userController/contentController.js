const asyncHandler = require("../../utils/asyncHandler");
const StaticContentService = require("../../services/contentService");
const successHandler = require("../../middleware/globalSuccessHandler");


const staticContentController = {

    getAllStaticContents: asyncHandler(async (req, res) => {
      
        const result = await StaticContentService.getAllStaticContents();
        return successHandler(res, 200, result.message, result.data);
    }),

    getStaticContentById: asyncHandler(async (req, res) => {
        const { id } = req.params;
      
        const result = await StaticContentService.getStaticContentById(id);
        return successHandler(res, 200, result.message, result.data);
    }),

    getStaticContentByType: asyncHandler(async (req, res) => {
        const { type } = req.params;
       
        const result = await StaticContentService.getStaticContentByType(type);
        return successHandler(res, 200, result.message, result.data);
    }),
};

module.exports = staticContentController;
