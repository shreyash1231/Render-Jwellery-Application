const express = require("express");
const router = express.Router();
const { authLimiter, uploadLimiter } = require("../../middleware/rateLimiters");
const authController = require("../../controller/userController/authController");
const authorize = require("../../middleware/authMiddleware");
const upload = require("../../middleware/uploadMiddleware");

router.route("/register").post(authController.register);
router.route("/login").post(authLimiter, authController.loginUser);
router.route("/google-login").post(authLimiter, authController.googleLogin);
router.route("/forgot-password").post(authLimiter, authController.sendOtp);
router
  .route("/verify-reset-otp")
  .post(authorize(["USER"]), authController.verifyResetOtp);
  
router.route("/resend-signup-otp").post(authorize(["USER"]), authController.resendSignupOtp);
router.route("/verify-otp").post(authorize(["USER"]), authController.verifyOtp);

router
  .route("/reset-password")
  .patch(authorize(["USER"]), authController.resetPassword);
router
  .route("/change-password")
  .patch(authorize(["USER"]), authController.changePassword);

router
  .route("/get-profile")
  .get(authorize(["USER"]), authController.getUserDetails);

router
  .route("/upadate-profile")
  .patch(
    authorize(["USER"]),
    uploadLimiter,
    upload.single("image"),
    authController.updateProfile,
  );

router
  .route("/delete-account")
  .delete(authorize(["USER"]), authController.deleteUser);

module.exports = router;
