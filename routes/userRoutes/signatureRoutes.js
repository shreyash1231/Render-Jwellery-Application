const express = require("express");
const router = express.Router();
const signatureController = require("../../controller/userController/signatureController");

router.route("/get-all-signatures").get(signatureController.getAllSignatures);
router.route("/get-signature/:id").get(signatureController.getSignatureById);

module.exports = router;
