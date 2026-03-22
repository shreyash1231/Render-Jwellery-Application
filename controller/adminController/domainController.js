const asyncHandler = require("../../utils/asyncHandler");
const errorResponse = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");
const { createDomainValidation, } = require("../../validation/domainValidation");
const DomainService = require('../../services/domainService');
const validationError = require("../../utils/validationError");
const { uploadFileToS3 } = require("../../middleware/uploadFile");
const errorHandler = require("../../middleware/globalErrorHandler");

const TTL = 60;

const domainController = {

    createDomain: asyncHandler(async (req, res) => {
        if (req.file) {
            const imageUrl = await uploadFileToS3(req.file);
            req.body.imageUrl = imageUrl;
        }
        const { error, value } = createDomainValidation(req.body);
        if (error) {
            return errorHandler(
                { statusCode: 400, message: validationError(error) },
                req,
                res
            );
        }

        const result = await DomainService.createDomain(value);

        return successHandler(res, 201, result.message, result.data);
    }),

    getAllDomains: asyncHandler(async (req, res) => {
      
        const result = await DomainService.getAllDomains();
        return successHandler(res, 200, result.message, result.data);
    }),

    getDomainById: asyncHandler(async (req, res) => {
        const id = req.params.id;
       
        const result = await DomainService.getDomainById(id);
        return successHandler(res, 200, result.message, result.data);
    }),

    updateDomain: asyncHandler(async (req, res) => {
        if (req.file) {
            const imageUrl = await uploadFileToS3(req.file);
            req.body.imageUrl = imageUrl;
        }

        const result = await DomainService.updateDomain(req.params.id, req.body);
    
        return successHandler(res, 200, result.message, null);
    }),

    deleteDomain: asyncHandler(async (req, res) => {
        const result = await DomainService.deleteDomain(req.params.id);
      
        return successHandler(res, 200, result.message, null);
    }),

};

module.exports = domainController;
