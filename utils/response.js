class SuccessResponse {
  constructor(statusCode = 200, message, data = {}) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports= { SuccessResponse, ErrorResponse };
