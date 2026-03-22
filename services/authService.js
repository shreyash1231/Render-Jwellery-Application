const Admin = require("../models/adminModel");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const sendOtpToEmail = require("../utils/sendOtp");
const Users = require("../models/userModel");

class AuthService {
  // ============================
  // REGISTER ADMIN (optional)
  // ============================
  async registerAdmin(body) {
    const { email, password } = body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      throw new Error("Admin already exists");
    }

    const hashedPassword = await argon2.hash(password);

    const admin = await Admin.create({
      email,
      password: hashedPassword,
      role: "ADMIN",
      isVerified: false,
    });

    return {
      success: true,
      message: "Admin registered successfully",
      data: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  // ============================
  // LOGIN ADMIN
  // ============================
  async loginAdmin(body) {
    const { email, password } = body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await argon2.verify(admin.password, password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    if (!admin.isVerified) {
      const otpResult = await this.sendOtp(email);
      return {
        success: true,
        message: "Please verify your email. OTP sent.",
        data: {
          token: otpResult.token,
          isVerified: false,
        },
      };
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      "secret",
      { expiresIn: "20d" }
    );

    return {
      success: true,
      message: "Admin login successful",
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
        },
        token,
        isVerified: true,
      },
    };
  }

  // ============================
  // SEND OTP (ADMIN)
  // ============================
  async sendOtp(email) {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new Error("Admin not found");
    }

    const otp = Math.floor(10000 + Math.random() * 90000);

    await sendOtpToEmail(email, otp);

    const hashedOtp = await argon2.hash(otp.toString());

    const token = jwt.sign(
      {
        otp: hashedOtp,
        email: admin.email,
        role: admin.role,
      },
      "secret",
      { expiresIn: "5m" }
    );

    return {
      success: true,
      message: "OTP sent successfully",
      token,
    };
  }

  // ============================
  // VERIFY OTP (EMAIL VERIFY)
  // ============================
  async verifyOtp(body) {
    const { email, otp, hashedOtp } = body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new Error("Admin does not exist");
    }

    if (admin.isVerified) {
      throw new Error("Email already verified");
    }

    const isValid = await argon2.verify(hashedOtp, otp);
    if (!isValid) {
      throw new Error("Invalid OTP");
    }

    admin.isVerified = true;
    await admin.save();

    return {
      success: true,
      message: "Email verified successfully",
    };
  }

  // ============================
  // VERIFY OTP (RESET PASSWORD)
  // ============================
  async verifyResetOtp(body) {
    const { email, otp, hashedOtp } = body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new Error("Admin does not exist");
    }

    const isValid = await argon2.verify(hashedOtp, otp);
    if (!isValid) {
      throw new Error("Invalid OTP");
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      "secret",
      { expiresIn: "20m" }
    );

    return {
      success: true,
      message: "OTP verified successfully",
      data: token,
    };
  }

  // ============================
  // RESET PASSWORD (FORGOT)
  // ============================
  async resetPassword(password, email) {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new Error("Admin does not exist");
    }

    admin.password = await argon2.hash(password);
    await admin.save();

    return {
      success: true,
      message: "Password reset successfully",
    };
  }

  // ============================
  // CHANGE PASSWORD (LOGGED IN)
  // ============================
  async changePassword(body, adminId) {
    const { oldPassword, newPassword } = body;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw new Error("Admin does not exist");
    }

    const isValid = await argon2.verify(admin.password, oldPassword);
    if (!isValid) {
      throw new Error("Old password is incorrect");
    }

    admin.password = await argon2.hash(newPassword);
    await admin.save();

    return {
      success: true,
      message: "Password changed successfully",
    };
  }

   async getAllUsers() {
    const users = await Users.find().select("-password").lean();
    return {
      success: true,
      message: "Users fetched successfully",
      data: users,
    };
  }
}

module.exports = new AuthService();
