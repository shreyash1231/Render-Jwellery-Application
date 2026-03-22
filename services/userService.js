// authService.js
const User = require("../models/userModel");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const sendOtpModule = require("../utils/sendOtp");

const bcrypt = require("bcrypt");
const sendOtpToEmail = sendOtpModule.sendOtpToEmail;
const sendOtpToSms = sendOtpModule.sendOtpToSms;
const envSecrets = require("../config/index");
const {
  toRegisterUserDTO,
  toLoginDTO,
  toChangePasswordDTO,
  toPublicUser,
} = require("../dto/user.dto");

const jwtSecret = envSecrets.JWT_SECRET || "secret";
const jwtExpiry = envSecrets.JWT_EXPIRES_IN || "20d";
const normalizeGoogleAudience = (value = "") =>
  value
    .trim()
    .replace(/^['"]+|['";]+$/g, "");

const googleAudiences = (
  envSecrets.GOOGLE_CLIENT_IDS || envSecrets.GOOGLE_CLIENT_ID || ""
)
  .split(",")
  .map(normalizeGoogleAudience)
  .filter(Boolean);
const googleClient = googleAudiences.length > 0
  ? new OAuth2Client(googleAudiences[0])
  : null;

const buildUserToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
    expiresIn: jwtExpiry,
  });

const splitGoogleName = (payload) => {
  const givenName = payload.given_name?.trim();
  const familyName = payload.family_name?.trim();

  if (givenName || familyName) {
    return {
      firstName: givenName || "Google",
      lastName: familyName || "User",
    };
  }

  const fullName = payload.name?.trim();
  if (fullName) {
    const [firstName, ...lastNameParts] = fullName.split(/\s+/);
    return {
      firstName: firstName || "Google",
      lastName: lastNameParts.join(" ") || "User",
    };
  }

  const emailName = payload.email?.split("@")[0] || "google-user";
  return {
    firstName: emailName,
    lastName: "User",
  };
};

class UserService {
  async registerUser(body) {
    const { firstName, lastName, email, password, phone, countryCode } = body;

    const existingUser = await User.findOne({
      $or: [{ phone }, { email }],
    }).lean();
    
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Normalize phone/countryCode to numbers for model (frontend may send strings)
    const phoneNum = typeof phone === "string" ? parseInt(phone, 10) : phone;
    const countryCodeStr = String(countryCode || "").replace(/^\D+/, "") || "91";
    const countryCodeNum = parseInt(countryCodeStr, 10);

    // Password optional at signup: OTP sent to mobile via Twilio; use placeholder if not provided
    const passwordToHash = password && String(password).trim()
      ? password
      : `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const hashedPassword = await bcrypt.hash(passwordToHash, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone: phoneNum,
      countryCode: countryCodeNum,
    });

    // Send OTP to mobile number via Twilio (commented out: email OTP)
    // const otpResult = await this.sendOtp(email);  // was: send OTP to email
    // const phoneE164 = (String(countryCode).startsWith("+") ? String(countryCode) : `+${countryCode}`) + String(phoneNum).replace(/\D/g, "");
    const otpResult = await this.sendOtp(email);

    return {
      success: true,
      message: "User registered successfully. OTP sent to your mobile number.",
      data: {
        user: user,
        token: otpResult.token,
      },
    };
  }
  async loginUser(body) {
    const { email, password } = body;

    console.log("email and password",email,password)

    const user = await User.findOne({ email }).lean();
    if (!user) {
      throw new Error("Invalid email or password");
    }
    if (!user.password) {
      throw new Error("This account uses Google Sign-In. Please continue with Google.");
    }
    const currhashedpassword = await bcrypt.hash(password,10);
    console.log("current password", currhashedpassword);
    console.log("database password",user.password)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    if (!user.isVerified) {
      const otpResult = await this.sendOtp(email);
      return {
        success: true,
        message: "Please verify your email. OTP sent to your email.",
        data: {
          user: toPublicUser(user),
          token: otpResult.token,
          isVerified: false,
        },
      };
    }

    const token = buildUserToken(user);

    return {
      success: true,
      message: "Login successful",
      data: {
        user: toPublicUser(user),
        token,
        isVerified: true,
      },
    };
  }

  async googleLogin(body) {
    const { idToken } = body;

    if (!googleClient || googleAudiences.length === 0) {
      throw new Error("Google login is not configured on the server");
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: googleAudiences,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload.email_verified) {
      throw new Error("Google account email is not verified");
    }

    let user = await User.findOne({ email: payload.email.toLowerCase() });

    if (!user) {
      const { firstName, lastName } = splitGoogleName(payload);

      user = await User.create({
        firstName,
        lastName,
        email: payload.email.toLowerCase(),
        phone: null,
        countryCode: null,
        role: "USER",
        isVerified: true,
        profilePic: payload.picture,
        authProvider: "google",
        googleId: payload.sub,
      });
    } else {
      if (user.googleId && user.googleId !== payload.sub) {
        throw new Error("Google account does not match this user");
      }

      user.googleId = payload.sub;
      user.isVerified = true;
      user.profilePic = payload.picture || user.profilePic;
      if (!user.authProvider || user.authProvider === "google") {
        user.authProvider = "google";
      }

      await user.save();
    }

    const token = buildUserToken(user);

    return {
      success: true,
      message: "Google login successful",
      data: {
        user: toPublicUser(user),
        token,
        isVerified: true,
      },
    };
  }

  async sendOtp(email) {
    const user = await User.findOne({ email }).lean();
    if (!user) {
      throw new Error("User not found");
    }

    // generate 5-digit OTP
    const otp = Math.floor(10000 + Math.random() * 90000);
    const resss = await sendOtpToEmail(email, otp);

    const hashedOtp = await argon2.hash(otp.toString());

    const token = jwt.sign(
      { otp: hashedOtp, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: "5m" },
    );

    return { success: true, message: "OTP sent successfully", token };
  }

  /**
   * Send OTP to mobile number via Twilio (for signup). Same token structure as sendOtp.
   */
  async sendOtpToPhone(email, phoneE164) {
    const user = await User.findOne({ email }).lean();
    if (!user) {
      throw new Error("User not found");
    }

    const otp = Math.floor(10000 + Math.random() * 90000);
    await sendOtpToSms(phoneE164, otp);

    const hashedOtp = await argon2.hash(otp.toString());

    const token = jwt.sign(
      { otp: hashedOtp, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: "5m" },
    );

    return { success: true, message: "OTP sent successfully", token };
  }

  /**
   * Resend signup OTP to user's mobile number (by email from token).
   */
  async resendSignupOtp(email) {
    const user = await User.findOne({ email }).lean();
    if (!user) {
      throw new Error("User not found");
    }
    const cc = user.countryCode != null ? String(user.countryCode) : "91";
    const p = user.phone != null ? String(user.phone).replace(/\D/g, "") : "";
    if (!p) {
      throw new Error("Phone number not found for this account");
    }
    const phoneE164 = (cc.startsWith("+") ? cc : `+${cc}`) + p;
    return this.sendOtpToPhone(email, phoneE164);
  }

  async verifyOtp(body) {
    const { email, otp, hashedOtp } = body;

    const findUser = await User.findOne({ email: email }).lean();
    if (!findUser) {
      throw new Error("User does not exist");
    }

    const isValid = await argon2.verify(hashedOtp, otp);
    if (!isValid) {
      throw new Error("Invalid OTP");
    }
    if (User.isVerified) {
      throw new Error("Email Already Verified");
    }

    await User.updateOne({ email }, { $set: { isVerified: true } });

    return { success: true, message: "OTP verified successfully" };
  }

  async verifyResetOtp(body) {
    const { email, otp, hashedOtp } = body;

    const findUser = await User.findOne({ email }).lean();
    if (!findUser) {
      throw new Error("User does not exist");
    }

    const isValid = await argon2.verify(hashedOtp, otp);
    if (!isValid) {
      throw new Error("Invalid OTP");
    }

    const token = jwt.sign(
      { id: findUser._id, email: findUser.email, role: findUser.role },
      jwtSecret,
      { expiresIn: jwtExpiry },
    );

    return {
      success: true,
      message: "OTP verified successfully",
      data: token,
    };
  }

  async resetPassword(password, email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User does not exist");
    }

    const hashedPassword = await argon2.hash(password);
    user.password = hashedPassword;
    await user.save();

    return { success: true, message: "Password reset successfully" };
  }

  async changePassword(body, id) {
    const { oldPassword, newPassword } = toChangePasswordDTO(body);
    const user = await User.findOne({ _id: id });
    if (!user) {
      throw new Error("User does not exist");
    }

    const checkPassword = await argon2.verify(user.password, oldPassword);
    if (!checkPassword) {
      throw new Error("Old password is incorrect");
    }

    const hashedPassword = await argon2.hash(newPassword);
    user.password = hashedPassword;
    await user.save();

    return { success: true, message: "Password changed successfully" };
  }

  async getUserDetails(userId) {
    const user = await User.findOne({
      _id: userId,
      deletedAt: null,
    }).select("-password").lean();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async updateProfile(userId, payload) {
    const user = await User.findOne({
      _id: userId,
      deletedAt: null,
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (payload.firstName !== undefined) {
      user.firstName = payload.firstName;
    }

    if (payload.lastName !== undefined) {
      user.lastName = payload.lastName;
    }

    if (payload.image !== undefined) {
      user.profilePic = payload.image;
    }

    await user.save();

    return user;
  }

  async deleteUser(userId) {
    const user = await User.findById(userId).lean();

    if (!user) {
      throw new Error("User not found");
    }

    await User.findByIdAndDelete(userId);

    return {
      success: true,
      message: "User deleted successfully",
    };
  }
}

module.exports = new UserService();
