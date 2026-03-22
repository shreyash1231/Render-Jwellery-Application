const asyncHandler = require("../../utils/asyncHandler");
const bannerService = require("../../services/bannerService");
const { createBannerValidation, updateBannerValidation } = require("../../validation/bannerValidation");
const validationError = require("../../utils/validationError");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");
const { uploadFileToS3 } = require("../../middleware/uploadFile");

const bannerController = {

    createBanner: asyncHandler(async (req, res) => {
        
        if (req.file) {
            const imageUrl = await uploadFileToS3(req.file);
            req.body.imageUrl = imageUrl;
        }
        const { error, value } = createBannerValidation(req.body);
        if (error) {
            return errorHandler(
                { statusCode: 400, message: validationError(error) },
                req,
                res
            );
        }

        const result = await bannerService.createBanner(value);
        return successHandler(res, 201, result.message, result.data);
    }),

    getAllBanners: asyncHandler(async (req, res) => {
        const result = await bannerService.getAllBanners();
        return successHandler(res, 200, result.message, result.data);
    }),

    getBannerById: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const result = await bannerService.getBannerById(id);
        return successHandler(res, 200, result.message, result.data);
    }),

    updateBanner: asyncHandler(async (req, res) => {
        const { id } = req.params;
        if (req.file) {
            const imageUrl = await uploadFileToS3(req.file);
            req.body.imageUrl = imageUrl;
        }

        const { error, value } = updateBannerValidation(req.body);
        if (error) {
            return errorHandler(
                { statusCode: 400, message: validationError(error) },
                req,
                res
            );
        }

        const result = await bannerService.updateBanner(id, value);
        return successHandler(res, 200, result.message, result.data);
    }),

    deleteBanner: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const result = await bannerService.deleteBanner(id);
        return successHandler(res, 200, result.message, null);
    }),

};

module.exports = bannerController;
