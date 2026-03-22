const { ErrorResponse } = require("../utils/response.js");
const { logToFile } = require("../utils/logger.js");

const errorHandler = (err, req, res, next) => {
  // ✅ Force numeric HTTP status
  let statusCode = 500;

  if (Number.isInteger(err.statusCode)) {
    statusCode = err.statusCode;
  } else if (Number.isInteger(err.status)) {
    statusCode = err.status;
  }

  let errorName = err.name || "Error";

  /* ===================== SPECIAL ERROR CASES ===================== */

  if (err.code === "ENOENT") {
    statusCode = 404;
    errorName = "FILE_NOT_FOUND";
    err.message = "Requested file not found";
  }

  if (err.name === "CastError") {
    statusCode = 404;
    errorName = "RESOURCE_NOT_FOUND";
    err = new ErrorResponse(
      `Resource not found with id of ${err.value}`,
      statusCode,
    );
  }

  if (err.code === 11000) {
    statusCode = 409;
    errorName = "DUPLICATE_KEY";
    err = new ErrorResponse("Duplicate key error", statusCode);
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    errorName = "INVALID_TOKEN";
    err = new ErrorResponse("Token is invalid. Try again.", statusCode);
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    errorName = "TOKEN_EXPIRED";
    err = new ErrorResponse("Token is expired. Try again.", statusCode);
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    errorName = "VALIDATION_ERROR";
    err = new ErrorResponse(
      Object.values(err.errors).map((val) => val.message),
      statusCode,
    );
  }

  /* ===================== LOGGING ===================== */

  const logObj = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    status: statusCode,
    error: errorName,
    message: err.message,
    stack: err.stack,
    user: req.user ? req.user.id : null,
    ip: req.ip,
  };

  console.error(JSON.stringify(logObj, null, 2));
  // logToFile(logObj);

  /* ===================== RESPONSE ===================== */

  res.status(statusCode).json({
    success: false,
    code: statusCode,
    error: errorName,
    message: err.message || "Server Error",
    details: err.details || undefined,
  });
};

module.exports = errorHandler;
