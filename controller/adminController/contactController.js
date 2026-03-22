const asyncHandler = require("../../utils/asyncHandler");
const contactService = require("../../services/contactService")
const { contactValidation } = require("../../validation/contactValidation");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");
const validationError = require("../../utils/validationError");

const contactController = {
    createContact: asyncHandler(async (req, res) => {
        const { error, value } = contactValidation(req.body);
        if (error) {
            return errorHandler(
                { statusCode: 400, message: validationError(error) },
                req,
                res
            );
        }

        const result = await contactService.createContact(value);
      
        return successHandler(res, 201, result.message, result.data);
    }),

    getAllContacts: asyncHandler(async (req, res) => {
       
        const result = await contactService.getAllContact();
     
        return successHandler(res, 200, result.message, result.data);
    }),

    getByIdContact: asyncHandler(async (req, res) => {
      
        const result = await contactService.getByIdContact(req.params.id);
        return successHandler(res, 200, result.message, result.data);
    }),

    updateContact: asyncHandler(async (req, res) => {
        const result = await contactService.updateContact(req.params.id, req.body);
        
        return successHandler(res, 200, result.message, null);
    }),

    deleteContact: asyncHandler(async (req, res) => {
        const result = await contactService.deleteContact(req.params.id);
       
        return successHandler(res, 200, result.message, null);
    }),
};

module.exports = contactController;
