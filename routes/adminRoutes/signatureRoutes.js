const express = require("express");
const router = express.Router();
const signatureController = require("../../controller/adminController/signatureController");
const upload = require("../../middleware/uploadMiddleware");
const { uploadLimiter } = require("../../middleware/rateLimiters");

router
  .route("/create-signature")
  .post(
    uploadLimiter,
    upload.single("image"),
    signatureController.createSignature
  );
router.route("/get-all-signatures").get(signatureController.getAllSignatures);
router.route("/get-signature/:id").get(signatureController.getSignatureById);
router
  .route("/update-signature/:id")
  .patch(
    uploadLimiter,
    upload.single("image"),
    signatureController.updateSignature
  );
router
  .route("/delete-signature/:id")
  .delete(signatureController.deleteSignature);

module.exports = router;
