const authService = require("../../services/authService");
const {
  registerAdminValidation,
  loginUserValidation,
  sendOtpValidation,
  changePasswordValidation,
} = require("../../validation/authValidation");
const asyncHandler = require("../../utils/asyncHandler");
const validationError = require("../../utils/validationError");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");

const authController = {
  // ============================
  // REGISTER ADMIN (OPTIONAL)
  // ============================
  registerAdmin: asyncHandler(async (req, res) => {
    const { error, value } = registerAdminValidation(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res,
      );
    }

    const result = await authService.registerAdmin(value);
    return successHandler(res, 201, result.message, result.data);
  }),

  // ============================
  // LOGIN ADMIN
  // ============================
  loginAdmin: asyncHandler(async (req, res) => {
    const { error, value } = loginUserValidation(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res,
      );
    }

    const result = await authService.loginAdmin(value);

    if (result?.data?.token) {
      res.cookie("token", result.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 20 * 24 * 60 * 60 * 1000, // 20 days
      });
    }

    return successHandler(res, 200, result.message, result.data);
  }),

  // ============================
  // SEND OTP (ADMIN)
  // ============================
  sendOtp: asyncHandler(async (req, res) => {
    const { error, value } = sendOtpValidation(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res,
      );
    }

    const result = await authService.sendOtp(value.email);

    if (result.token) {
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 5 * 60 * 1000, // 5 minutes
      });
    }

    return successHandler(res, 200, result.message, null);
  }),

  // ============================
  // VERIFY EMAIL OTP
  // ============================
  verifyOtp: asyncHandler(async (req, res) => {
    const { otp } = req.body;
    const { email, hashedOtp } = req.user;

    if (!otp) {
      return errorHandler(
        { statusCode: 400, message: "Enter the OTP" },
        req,
        res,
      );
    }

    await authService.verifyOtp({ email, otp, hashedOtp });
    return successHandler(res, 200, "OTP verified successfully");
  }),

  // ============================
  // VERIFY RESET OTP
  // ============================
  verifyResetOtp: asyncHandler(async (req, res) => {
    const { otp } = req.body;
    const { email, hashedOtp } = req.user;

    if (!otp) {
      return errorHandler(
        { statusCode: 400, message: "Enter the OTP" },
        req,
        res,
      );
    }

    const result = await authService.verifyResetOtp({
      email,
      otp,
      hashedOtp,
    });

    return successHandler(res, 200, result.message, result.data);
  }),

  // ============================
  // RESET PASSWORD
  // ============================
  resetPassword: asyncHandler(async (req, res) => {
    const { password, confirmPassword } = req.body;
    const { email } = req.user;

    if (password !== confirmPassword) {
      return errorHandler(
        {
          statusCode: 400,
          message: "Password & Confirm Password do not match",
        },
        req,
        res,
      );
    }

    const result = await authService.resetPassword(password, email);
    return successHandler(res, 200, result.message);
  }),

  // ============================
  // CHANGE PASSWORD (LOGGED IN)
  // ============================
  changePassword: asyncHandler(async (req, res) => {
    const { error, value } = changePasswordValidation(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res,
      );
    }

    const { newPassword, confirmPassword } = value;
    if (newPassword !== confirmPassword) {
      return errorHandler(
        {
          statusCode: 400,
          message: "Password & Confirm Password do not match",
        },
        req,
        res,
      );
    }

    const { id } = req.user;
    const result = await authService.changePassword(value, id);

    return successHandler(res, 200, result.message);
  }),
  
  getAllUsers: asyncHandler(async (req, res) => {
    const result = await authService.getAllUsers();
    return successHandler(
      res,
      200,
      "All users fetched successfully",
      result.data,
    );
  }),
};

module.exports = authController;
