const asyncHandler = require("../../utils/asyncHandler");
const couponService = require("../../services/couponService");
const {
  createCouponValidation,
  updateCouponValidation,
} = require("../../validation/couponValidation");
const validationError = require("../../utils/validationError");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");

const couponController = {
  createCoupon: asyncHandler(async (req, res) => {
    const { error, value } = createCouponValidation(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res
      );
    }

    const result = await couponService.createCoupon(value);
    return successHandler(res, 201, result.message, result.data);
  }),

  getAllCoupons: asyncHandler(async (req, res) => {
    const result = await couponService.getAllCoupons();
    return successHandler(res, 200, result.message, result.data);
  }),

getAllToUserCoupons: asyncHandler(async (req, res) => {
  const userId = req.user.id; // extracted from token middleware
  const result = await couponService.getAllToUserReedemCode(userId);
  return successHandler(res, 200, result.message, result.data);
}),

  getCouponById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await couponService.getCouponById(id);
    return successHandler(res, 200, result.message, result.data);
  }),

  updateCoupon: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { error, value } = updateCouponValidation(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res
      );
    }


    const result = await couponService.updateCoupon(id, value);
    return successHandler(res, 200, result.message, result.data);
  }),

  deleteCoupon: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await couponService.deleteCoupon(id);
    return successHandler(res, 200, result.message, null);
  }),

  getCouponUsage: asyncHandler(async (req, res) => {
    const { couponCode } = req.params;

    if (!couponCode) {
      return errorHandler(
        { statusCode: 400, message: "Coupon code is required" },
        req,
        res
      );
    }

    const result = await couponService.getCouponUsageByCode(couponCode);
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = couponController;
