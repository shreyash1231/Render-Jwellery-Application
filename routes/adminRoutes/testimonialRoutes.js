
const express = require('express');
const router = express.Router();
const testimonialController = require("../../controller/adminController/testimonialController")
const authorize = require("../../middleware/authMiddleware");
const upload = require("../../middleware/uploadMiddleware");
const { uploadLimiter } = require("../../middleware/rateLimiters");
const validateObjectId = require("../../middleware/validateObjectId");

router.route("/add-testimonial").post(uploadLimiter, upload.single("image"), testimonialController.createTestimonial);
router.route("/get-all-testimonial").get(testimonialController.getAllTestimonials);
router.route("/get-testimonial/:id").get(validateObjectId(), testimonialController.getTestimonialById);
router.route("/update-testimonial/:id").patch(validateObjectId(), uploadLimiter, upload.single("image"), testimonialController.updateTestimonial);
router.route("/delete-testimonial/:id").delete(validateObjectId(), testimonialController.deleteTestimonial);


module.exports = router;