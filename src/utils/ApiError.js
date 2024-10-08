class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = Math.floor(statusCode / 100) === 4 ? 'fail' : 'error';
    this.isOperational = isOperational;
    // this.config = {error.showToast}
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
