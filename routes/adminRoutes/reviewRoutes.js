const express = require("express");
const router = express.Router();
const reviewController = require("../../controller/adminController/reviewController");
const validateObjectId = require("../../middleware/validateObjectId");
const upload = require("../../middleware/uploadMiddleware");
const { uploadLimiter } = require("../../middleware/rateLimiters");

router
  .route("/create-review")
  .post(uploadLimiter, upload.array("media", 10), reviewController.createReview);
router.route("/get-all-reviews").get(reviewController.getAllReviews);
router
  .route("/update-review/:id")
  .patch(validateObjectId(), uploadLimiter, upload.array("media", 10), reviewController.updateReview);
router
  .route("/delete-review/:id")
  .delete(validateObjectId(), reviewController.deleteReview);

module.exports = router;
