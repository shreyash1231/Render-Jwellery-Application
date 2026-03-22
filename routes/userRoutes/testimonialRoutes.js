
const express = require('express');
const router = express.Router();
const testimonialController = require("../../controller/userController/testimonialController")

router.route("/get-all-testimonial").get(testimonialController.getAllTestimonials);
router.route("/get-testimonial/:id").get(testimonialController.getTestimonialById);



module.exports = router;