class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.status = String(statusCode).startsWith(4) ? "Fail" : "error";
    this.statusCode = this.statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
