const express = require("express");
const router = express.Router();

const aboutUsController = require("../../controller/adminController/aboutUsController");
const upload = require("../../middleware/uploadMiddleware");
const { uploadLimiter } = require("../../middleware/rateLimiters");
const validateObjectId = require("../../middleware/validateObjectId");

/* CREATE */
router.post(
  "/about-us",
  uploadLimiter,
  upload.single("image"),
  aboutUsController.createAboutUs
);

/* GET */
router.get("/about-us", aboutUsController.getAboutUs);

/* UPDATE BY ID */
router.patch(
  "/about-us/:id",
  validateObjectId(),
  uploadLimiter,
  upload.single("image"),
  aboutUsController.updateAboutUs
);

/* DELETE BY ID */
router.delete(
  "/about-us/:id",
  validateObjectId(),
  aboutUsController.deleteAboutUs
);

module.exports = router;
