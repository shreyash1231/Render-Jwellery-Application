const express = require('express');
const router = express.Router();
const bannerController = require("../../controller/userController/bannerController");


router.route("/get-all-banners").get(bannerController.getAllBanners);

module.exports = router;
