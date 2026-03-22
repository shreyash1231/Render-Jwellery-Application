const asyncHandler = require("../../utils/asyncHandler");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");

const addressService = require("../../services/addressService");
const {
  createAddressValidation,
  updateAddressValidation,
} = require("../../validation/addressValidation");

const addressController = {
  // CREATE ADDRESS
  createAddress: asyncHandler(async (req, res) => {
    const { error } = createAddressValidation(req.body);

    if (error) {
      return errorHandler(
        {
          statusCode: 400,
          message: error.details.map((e) => e.message).join(", "),
        },
        req,
        res
      );
    }

    const userId = req.user.id;
    const result = await addressService.createAddress(userId, req.body);

    return successHandler(res, 201, "Address created successfully", result);
  }),

  getAddresses: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await addressService.getAddresses(userId);

    return successHandler(res, 200, "Addresses fetched successfully", result?.data);
  }),

  getAddress: asyncHandler(async (req, res) => {
    const address = await addressService.getAddressById(req.params.id);

    if (!address) {
      return errorHandler(
        {
          statusCode: 404,
          message: "Address not found",
        },
        req,
        res
      );
    }

    if (address.userId.toString() !== req.user.id) {
      return errorHandler(
        {
          statusCode: 403,
          message: "You are not authorized to access this address",
        },
        req,
        res
      );
    }

    return successHandler(res, 200, "Address fetched successfully", address);
  }),

  // UPDATE ADDRESS
  updateAddress: asyncHandler(async (req, res) => {
    const { error } = updateAddressValidation(req.body);

    if (error) {
      return errorHandler(
        {
          statusCode: 400,
          message: error.details.map((e) => e.message).join(", "),
        },
        req,
        res
      );
    }

    const userId = req.user.id;
    const result = await addressService.updateAddress(
      req.params.id,
      userId,
      req.body
    );

    if (!result) {
      return errorHandler(
        {
          statusCode: 404,
          message: "Address not found",
        },
        req,
        res
      );
    }

    return successHandler(res, 200, "Address updated successfully", result);
  }),

  // DELETE ADDRESS
  deleteAddress: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await addressService.deleteAddress(req.params.id, userId);

    if (!result) {
      return errorHandler(
        {
          statusCode: 404,
          message: "Address not found",
        },
        req,
        res
      );
    }

    return successHandler(res, 200, "Address deleted successfully", null);
  }),
};

module.exports = addressController;
