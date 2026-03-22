const express = require('express');
const router = express.Router();
const newsletterController = require("../../controller/adminController/newsLetterController")

router.route("/get-newsletter").get(newsletterController.getAllNewsletters);
router.route("/get-newsletter/:id").get(newsletterController.getNewsletterById);
router.route("/delete-newsletter/:id").delete(newsletterController.deleteNewsletter);

module.exports = router;