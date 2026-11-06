const express = require("express");
const router = express.Router();
const imageController = require("../../controller/userController/imageController");

router.route("/image-thumb").get(imageController.getThumbnail);

module.exports = router;
