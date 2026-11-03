const express = require("express");
const router = express.Router();
const marqueeController = require("../../controller/adminController/marqueeController");

router.route("/get-marquee").get(marqueeController.getMarquee);
router.route("/update-marquee").put(marqueeController.updateMarquee);

module.exports = router;
