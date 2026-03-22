const express = require('express');
const router = express.Router();
const domainController = require("../../controller/userController/domainController")

router.route("/get-all-domains").get(domainController.getAllDomains);
router.route("/get-domain/:id").get(domainController.getDomainById);

module.exports = router;