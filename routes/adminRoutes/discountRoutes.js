const express = require("express");
const router = express.Router();
const discountController = require("../../controller/adminController/discountController");
const validateObjectId = require("../../middleware/validateObjectId");

router.route("/create-discount").post(discountController.createDiscount);
router.route("/get-all-discounts").get(discountController.getAllDiscounts);
router
  .route("/update-discount/:id")
  .patch(validateObjectId(), discountController.updateDiscount);
router
  .route("/delete-discount/:id")
  .delete(validateObjectId(), discountController.deleteDiscount);

module.exports = router;
