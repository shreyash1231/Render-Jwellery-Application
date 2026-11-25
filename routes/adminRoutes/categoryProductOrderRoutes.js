const express = require("express");
const router = express.Router();
const controller = require("../../controller/adminController/categoryProductOrderController");
const validateObjectId = require("../../middleware/validateObjectId");

// Display order of products inside a category (Admin > Product Order)
router
  .route("/get-category-product-order/:categoryId")
  .get(validateObjectId("categoryId"), controller.getOrder);
router
  .route("/save-category-product-order/:categoryId")
  .put(validateObjectId("categoryId"), controller.saveOrder);

module.exports = router;
