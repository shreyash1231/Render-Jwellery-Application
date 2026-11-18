const express = require("express");
const router = express.Router();
const controller = require("../../controller/adminController/productCategoryController");
const validateObjectId = require("../../middleware/validateObjectId");

router.route("/get-all-product-categories").get(controller.getAll);
router
  .route("/get-product-categories/:productId")
  .get(validateObjectId("productId"), controller.getForProduct);
router.route("/save-product-categories").put(controller.save);
router
  .route("/update-product-category-status/:id")
  .patch(validateObjectId(), controller.updateStatus);
router
  .route("/delete-product-category/:id")
  .delete(validateObjectId(), controller.deleteOne);
router
  .route("/delete-product-categories/:productId")
  .delete(validateObjectId("productId"), controller.deleteForProduct);

module.exports = router;
