const jwt = require("jsonwebtoken");
const errorHandler = require("./globalErrorHandler");

const verifyOtp = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return errorHandler({ statusCode: 401, message: "Authorization header missing" }, req, res);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return errorHandler({ statusCode: 401, message: "Token missing" }, req, res);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return errorHandler({ statusCode: 401, message: "OTP expired or invalid" }, req, res);
    }

    req.user = {
      email: decoded.email,
      hashedOtp: decoded.otp
    };

    next();
  } catch (error) {
    return errorHandler({ statusCode: 400, message: error.message }, req, res);
  }
};

module.exports = verifyOtp;
