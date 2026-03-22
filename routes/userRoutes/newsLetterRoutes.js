const express = require('express');
const router = express.Router();
const newsletterController = require("../../controller/userController/newsLetterController")

router.route("/add-newsletter").post(newsletterController.createNewsletter);

module.exports = router;