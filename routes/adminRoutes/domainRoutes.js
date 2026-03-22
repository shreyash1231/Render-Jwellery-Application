const express = require('express');
const router = express.Router();
const domainController = require("../../controller/adminController/domainController")
const authorize = require("../../middleware/authMiddleware");
const upload = require("../../middleware/uploadMiddleware");
const { uploadLimiter } = require("../../middleware/rateLimiters");

router.route("/add-domain").post(authorize(["ADMIN"]), uploadLimiter, upload.single("image"), domainController.createDomain);
router.route("/get-all-domain").get(authorize(["ADMIN"]), domainController.getAllDomains);
router.route("/get-domain/:id").get(authorize(["ADMIN"]), domainController.getDomainById);
router.route("/update-domain/:id").patch(authorize(["ADMIN"]),upload.single("image"), domainController.updateDomain);
router.route("/delete-domain/:id").delete(authorize(["ADMIN"]), domainController.deleteDomain);

module.exports = router;