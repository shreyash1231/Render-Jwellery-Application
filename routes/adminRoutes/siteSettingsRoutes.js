const express = require("express");
const router = express.Router();
const siteSettingsController = require("../../controller/adminController/siteSettingsController");

router.route("/get-site-settings").get(siteSettingsController.getSettings);
router.route("/update-site-settings").put(siteSettingsController.updateSettings);

module.exports = router;
