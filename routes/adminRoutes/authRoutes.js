const express = require("express");
const router = express.Router();

const { authLimiter } = require("../../middleware/rateLimiters");
const authController = require("../../controller/adminController/authController");
const authorize = require("../../middleware/authMiddleware");

// ==========================
// AUTH ROUTES (ADMIN ONLY)
// ==========================

// OPTIONAL – enable only if you want admin registration
router.post("/register", authController.registerAdmin);

// LOGIN
router.post("/login", authLimiter, authController.loginAdmin);

// FORGOT PASSWORD → SEND OTP
router.post("/forgot-password", authLimiter, authController.sendOtp);

// VERIFY EMAIL OTP
router.post("/verify-otp", authorize(["ADMIN"]), authController.verifyOtp);

// VERIFY RESET OTP
router.post(
  "/verify-reset-otp",
  authorize(["ADMIN"]),
  authController.verifyResetOtp,
);

// RESET PASSWORD (AFTER OTP)
router.patch(
  "/reset-password",
  authorize(["ADMIN"]),
  authController.resetPassword,
);

// CHANGE PASSWORD (LOGGED IN)
router.patch(
  "/change-password",
  authorize(["ADMIN"]),
  authController.changePassword,
);

router.get("/get-all-users", authorize(["ADMIN"]), authController.getAllUsers);

module.exports = router;
