const express = require("express");
const router = express.Router();
const seoController = require("../../controller/adminController/seoController");

router.route("/get-seo-settings").get(seoController.getSettings);
router.route("/update-seo-settings").put(seoController.updateSettings);

module.exports = router;
