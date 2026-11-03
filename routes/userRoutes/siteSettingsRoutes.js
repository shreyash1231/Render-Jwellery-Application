const express = require("express");
const router = express.Router();
const siteSettingsController = require("../../controller/userController/siteSettingsController");

router.route("/get-site-settings").get(siteSettingsController.getSettings);

module.exports = router;
