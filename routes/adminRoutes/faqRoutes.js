
const express = require('express');
const router = express.Router();
const faqController = require("../../controller/adminController/faqController")

router.route("/add-faq").post(faqController.createFAQ);
router.route("/get-all-faq").get(faqController.getAllFAQ);
router.route("/get-faq/:id").get(faqController.getByIdFAQ);
router.route("/update-faq/:id").patch(faqController.updateFAQ);
router.route("/delete-faq/:id").delete(faqController.deleteFAQ);


module.exports = router;


