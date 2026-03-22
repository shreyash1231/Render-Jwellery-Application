const asyncHandler = require("../../utils/asyncHandler");
const contactService = require("../../services/contactService");
const {contactValidation} = require("../../validation/contactValidation");
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
    })

};

module.exports = contactController;
