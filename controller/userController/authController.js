const authService = require("../../services/userService");
const {
  registerUserValidation,
  loginUserValidation,
  sendOtpValidation,
  googleLoginValidation,
  changePasswordValidation,
  updateProfileValidation,
} = require("../../validation/userAuthValidation");
const asyncHandler = require("../../utils/asyncHandler");
const validationError = require("../../utils/validationError");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");
const userService = require("../../services/userService");
const { uploadFileToS3 } = require("../../middleware/uploadFile");

const authController = {
  register: asyncHandler(async (req, res) => {
    const reqObj = req.body;
    const { error, value } = registerUserValidation(reqObj);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res,
      );
    }

    const result = await authService.registerUser(value);
    if (result.data.token) {
      res.cookie("token", result.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 10 * 60 * 1000, // 10 minutes
      });
    }
    return successHandler(res, 201, result.message, result.data);
  }),

  loginUser: asyncHandler(async (req, res) => {
    const reqObj = req.body;
    const { error, value } = loginUserValidation(reqObj);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res,
      );
    }

    const result = await authService.loginUser(value);
    if (result.token) {
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }
    return successHandler(res, 200, result.message, result.data);
  }),

  googleLogin: asyncHandler(async (req, res) => {
    const { error, value } = googleLoginValidation(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res,
      );
    }

    const result = await authService.googleLogin(value);
    if (result?.data?.token) {
      res.cookie("token", result.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    return successHandler(res, 200, result.message, result.data);
  }),

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
        maxAge: 10 * 60 * 1000, // 10 minutes
      });
    }
    return successHandler(res, 200, result.message, { token: result.token });
  }),

  resendSignupOtp: asyncHandler(async (req, res) => {
    const { email } = req.user;
    const result = await authService.resendSignupOtp(email);
    if (result.token) {
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 10 * 60 * 1000,
      });
    }
    return successHandler(res, 200, result.message, { token: result.token });
  }),

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

    await authService.verifyOtp({ otp, email, hashedOtp });
    return successHandler(res, 200, "OTP verified successfully");
  }),

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

    const result = await authService.verifyResetOtp({ otp, email, hashedOtp });
    return successHandler(res, 200, "OTP verified successfully", result.data);
  }),

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
    return successHandler(res, 200, result.message, null);
  }),

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
        { statusCode: 400, message: "Password & ConfirmPassword do not match" },
        req,
        res,
      );
    }

    const { id } = req.user;
    const result = await authService.changePassword(value, id);
    return successHandler(res, 200, result.message, null);
  }),

  getUserDetails: asyncHandler(async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
      return errorHandler(
        { statusCode: 400, message: "User id is required" },
        req,
        res,
      );
    }

    const result = await userService.getUserDetails(userId);

    return successHandler(res, 200, "User fetched successfully", result);
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const reqObj = req.body;
    if (req.file) {
      const imageUrl = await uploadFileToS3(req.file);
      req.body.image = imageUrl;
    }
    console.log("reee",req.body.image)

    const { error, value } = updateProfileValidation(reqObj);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res,
      );
    }
    const userId = req.user.id;

    const result = await userService.updateProfile(userId, value);

    return successHandler(res, 200, "Profile updated successfully", result);
  }),

  deleteUser: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await authService.deleteUser(userId);
    return successHandler(res, 200, result.message, null);
  }),
};

module.exports = authController;
