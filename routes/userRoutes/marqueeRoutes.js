const express = require("express");
const router = express.Router();
const marqueeController = require("../../controller/userController/marqueeController");

router.route("/get-marquee").get(marqueeController.getMarquee);

module.exports = router;
