const express = require("express");
const router = express.Router();
const authorize = require("../../middleware/authMiddleware");
const orderController = require("../../controller/adminController/orderController");

router
  .route("/get-all-orders")
  .get(authorize(["ADMIN"]), orderController.getAllOrders);

router.route("/get-order-by-id/:id").get(authorize(["ADMIN"]), orderController.getOrderById)
  router.route("/update-status/:id").patch(authorize(["ADMIN"]), orderController.updateOrderStatus);

module.exports = router;
