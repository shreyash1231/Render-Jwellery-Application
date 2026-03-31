const express = require("express");
const router = express.Router();
const couponController = require("../../controller/adminController/couponController");
const validateObjectId = require("../../middleware/validateObjectId");
const authorize = require("../../middleware/authMiddleware");

router.route("/create-coupon").post(couponController.createCoupon);
router.route("/get-all-coupons").get(couponController.getAllCoupons);
router
  .route("/get-coupon/:id")
  .get(validateObjectId(), couponController.getCouponById);
router
  .route("/update-coupon/:id")
  .patch(validateObjectId(), couponController.updateCoupon);
router
  .route("/delete-coupon/:id")
  .delete(validateObjectId(), couponController.deleteCoupon);
router.route("/coupon-usage/:couponCode").get(couponController.getCouponUsage);

module.exports = router;
