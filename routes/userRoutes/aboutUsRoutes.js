const express = require("express");
const router = express.Router();

const aboutUsController = require("../../controller/userController/aboutUsController");

router.get("/about-us", aboutUsController.getAboutUs);


module.exports = router;
