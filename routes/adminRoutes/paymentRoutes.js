const express = require("express");
const router = express.Router();
const authorize = require("../../middleware/authMiddleware");
const paymentController = require("../../controller/adminController/paymentController");

router
  .route("/get-all-payments")
  .get(authorize(["ADMIN"]), paymentController.getAllPayments);

router
  .route("/order/:orderId")
  .get(authorize(["ADMIN"]), paymentController.getPaymentByOrderId);

module.exports = router;
