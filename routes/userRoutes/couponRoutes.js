const express = require("express");
const router = express.Router();
const couponController = require("../../controller/userController/couponController");
const authorize = require("../../middleware/authMiddleware");

router
  .route("/validate-coupon")
  .post(authorize(["USER"]), couponController.validateCoupon);
router
  .route("/get-all-coupons")
  .get(authorize(["USER"]), couponController.getAllCoupons);
router
  .route("/check-coupon-usage/:couponCode")
  .get(authorize(["USER"]), couponController.checkCouponUsage);
router
  .route("/coupon-history")
  .get(authorize(["USER"]), couponController.getCouponHistory);
router
  .route("/orders-with-coupons")
  .get(authorize(["USER"]), couponController.getOrdersWithCoupons);

module.exports = router;
