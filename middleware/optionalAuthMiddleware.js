const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const envSecrets = require("../config/index");
const Admin = require("../models/adminModel");
const User = require("../models/userModel");

const optionalAuthorize = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return next();
      }

      if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Invalid authorization format",
        });
      }

      token = authHeader.split(" ")[1];
    }

    const decoded = jwt.verify(token, envSecrets.JWT_SECRET);
    const { id, role, email, otp } = decoded;

    let account = null;

    if (role === "ADMIN") {
      account = await Admin.findById(id);
    } else if (role === "USER") {
      if (id && mongoose.Types.ObjectId.isValid(id)) {
        account = await User.findById(id);
      }
      if (!account && email) {
        account = await User.findOne({ email });
      }
    }

    if (!account) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    req.user = {
      id: account._id,
      email: account.email,
      role,
      hashedOtp: otp,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

module.exports = optionalAuthorize;
