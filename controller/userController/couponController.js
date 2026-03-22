const asyncHandler = require("../../utils/asyncHandler");
const couponService = require("../../services/couponService");
const { applyCouponValidation } = require("../../validation/couponValidation");
const validationError = require("../../utils/validationError");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");

const couponController = {
  /* ---------------- APPLY / VALIDATE COUPON ---------------- */
  validateCoupon: asyncHandler(async (req, res) => {
    const { error, value } = applyCouponValidation(req.body);

    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res
      );
    }

    const result = await couponService.applyCoupon({
      code: value.code,
      cartTotal: value.amount, // ✅ mapping FIXED
      userId: req.user?.id,
    });

    return successHandler(
      res,
      200,
      "Coupon applied successfully",
      result.data
    );
  }),

  /* ---------------- ADMIN / USER HELPERS ---------------- */

  getAllCoupons: asyncHandler(async (req, res) => {
    const result = await couponService.getAllCoupons();
    return successHandler(res, 200, "Coupons fetched successfully", result.data);
  }),

  checkCouponUsage: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { couponCode } = req.params;

    if (!couponCode) {
      return errorHandler(
        { statusCode: 400, message: "Coupon code is required" },
        req,
        res
      );
    }

    const result = await couponService.hasUserUsedCoupon(userId, couponCode);
    return successHandler(res, 200, result.message, result.data);
  }),

  getCouponHistory: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await couponService.getUserCouponHistory(userId);
    return successHandler(res, 200, result.message, result.data);
  }),

  getOrdersWithCoupons: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await couponService.getUserOrdersWithCoupons(userId);
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = couponController;
