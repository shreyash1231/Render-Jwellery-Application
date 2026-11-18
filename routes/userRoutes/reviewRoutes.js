const express = require("express");
const router = express.Router();
const reviewController = require("../../controller/userController/reviewController");
const validateObjectId = require("../../middleware/validateObjectId");

// Customers can only read reviews; they are added from the admin panel
router.route("/get-product-reviews/:id").get(validateObjectId(), reviewController.getProductReviews);

module.exports = router;
