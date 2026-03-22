const express = require("express");
const router = express.Router();
const optionalAuthorize = require("../../middleware/optionalAuthMiddleware");
const paymentController = require("../../controller/userController/paymentController");

router
  .route("/payment/create/:orderId")
  .post(optionalAuthorize, paymentController.createPayment);

// router
//   .route("/payment/:orderId")
//   .get(authorize(["USER"]), paymentController.get);

router
  .route("/verify-payment")
  .post(optionalAuthorize, paymentController.verifyPayment);

router.post(
  "/payment/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook,
);

module.exports = router;
