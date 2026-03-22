const express = require("express");
const router = express.Router();

const authorize = require("../../middleware/authMiddleware");
const customOrderController = require("../../controller/adminController/customOrderController");

router
  .route("/custom-order")
  .get(authorize(["ADMIN"]), customOrderController.getAllCustomOrders);

// UPDATE ORDER STATUS
router
  .route("/custom-order/:id")
  .patch(authorize(["ADMIN"]), customOrderController.updateCustomOrderStatus);

// DELETE CUSTOM ORDER
router
  .route("/custom-order/:id")
  .delete(authorize(["ADMIN"]), customOrderController.deleteCustomOrder);

module.exports = router;
