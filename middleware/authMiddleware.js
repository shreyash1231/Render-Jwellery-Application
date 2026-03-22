const jwt = require("jsonwebtoken");
const envSecrets = require("../config/index");
const errorHandler = require("./globalErrorHandler");
const mongoose = require("mongoose");

const Admin = require("../models/adminModel");
const User = require("../models/userModel");

const authorize = (roles = []) => {
  return async (req, res, next) => {
    try {
      let token = req.cookies?.token;

      // 1️⃣ Get token
      if (!token) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return errorHandler(
            { statusCode: 401, message: "Token missing" },
            req,
            res,
          );
        }
        if (!authHeader.startsWith("Bearer ")) {
          return errorHandler(
            { statusCode: 401, message: "Invalid authorization format" },
            req,
            res,
          );
        }
        token = authHeader.split(" ")[1];
      }

      console.log(token);

      // 2️⃣ Verify JWT
      const decoded = jwt.verify(token, envSecrets.JWT_SECRET);

      const { id, role, email, otp } = decoded;

      // 3️⃣ Role-based permission check
      if (roles.length && !roles.includes(role)) {
        return errorHandler(
          { statusCode: 403, message: "Access denied" },
          req,
          res,
        );
      }

      // 4️⃣ CHECK DB BASED ON ROLE (THIS IS WHAT YOU SAID)
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
      } else {
        return errorHandler(
          { statusCode: 401, message: "Invalid role" },
          req,
          res,
        );
      }
      // 5️⃣ If ID not found in DB → block
      if (!account) {
        return errorHandler(
          {
            statusCode: 404,
            message: `${role} does not exist in database`,
          },
          req,
          res,
        );
      }

      // 6️⃣ Attach fresh data
      req.user = {
        id: account._id,
        email: account.email,
        role: role,
        hashedOtp: otp,
      };

      next();
    } catch (error) {
      console.log("error", error);
      return errorHandler(
        {
          statusCode: 401,
          message: "Unauthorized",
        },
        req,
        res,
      );
    }
  };
};

module.exports = authorize;
