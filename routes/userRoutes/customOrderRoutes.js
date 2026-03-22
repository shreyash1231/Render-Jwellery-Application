const express = require("express");
const router = express.Router();

const authorize = require("../../middleware/authMiddleware");
const customOrderController = require("../../controller/userController/customOrderController");

/* ---------- USER ROUTES ---------- */

// CREATE CUSTOM ORDER
router
  .route("/custom-order")
  .post(authorize(["USER"]), customOrderController.createCustomOrder);

// GET MY CUSTOM ORDERS
router
  .route("/custom-order/me")
  .get(authorize(["USER"]), customOrderController.getMyCustomOrders);

// GET SINGLE CUSTOM ORDER
router
  .route("/custom-order/:id")
  .get(authorize(["USER"]), customOrderController.getCustomOrder);

/* ---------- ADMIN ROUTES ---------- */

// GET ALL CUSTOM ORDERS
router
  .route("/custom-order")
  .get(authorize(["USER"]), customOrderController.getAllCustomOrders);

// UPDATE ORDER STATUS
router
  .route("/custom-order/:id/status")
  .patch(authorize(["USER"]), customOrderController.updateCustomOrderStatus);

// DELETE CUSTOM ORDER
router
  .route("/custom-order/:id")
  .delete(authorize(["USER"]), customOrderController.deleteCustomOrder);

module.exports = router;
