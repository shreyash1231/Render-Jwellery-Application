
const express = require('express');
const router = express.Router();
const faqController = require("../../controller/userController/faqController")

router.route("/get-all-faqs").get(faqController.getAllFAQ);



module.exports = router;