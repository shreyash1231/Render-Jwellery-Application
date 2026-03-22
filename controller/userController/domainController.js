// controllers/domainController.js
const asyncHandler = require("../../utils/asyncHandler");
const errorResponse = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");
const { createDomainValidation, updateDomainValidation } = require("../../validation/domainValidation");
const DomainService = require('../../services/domainService');
const validationError = require("../../utils/validationError");

const domainController = {

    getAllDomains: asyncHandler(async (req, res) => {
     
        const result = await DomainService.getAllDomains();
        return successHandler(res, 200, result.message, result.data);
    }),

    getDomainById: asyncHandler(async (req, res) => {
       
        const result = await DomainService.getDomainById(req.params.id);
        return successHandler(res, 200, result.message, result.data);
    })
};

module.exports = domainController;
