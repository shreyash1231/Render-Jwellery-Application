const express = require("express");
const router = express.Router();
const seoController = require("../../controller/userController/seoController");

router.route("/get-seo-settings").get(seoController.getSettings);
router.route("/get-sitemap-data").get(seoController.getSitemapData);

module.exports = router;
