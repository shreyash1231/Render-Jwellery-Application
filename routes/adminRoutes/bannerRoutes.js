const express = require('express');
const router = express.Router();
const bannerController = require("../../controller/adminController/bannerController");
const upload = require('../../middleware/uploadMiddleware');
const { uploadLimiter } = require("../../middleware/rateLimiters");
const validateObjectId = require("../../middleware/validateObjectId");

router.route("/create-banner").post(uploadLimiter,   upload.single("file"), bannerController.createBanner);
router.route("/get-all-banners").get(bannerController.getAllBanners);
router.route("/get-banner/:id").get(validateObjectId(), bannerController.getBannerById);
router.route("/update-banner/:id").patch(validateObjectId(), uploadLimiter,   upload.single("file"), bannerController.updateBanner);
router.route("/delete-banner/:id").delete(validateObjectId(), bannerController.deleteBanner);

module.exports = router;


