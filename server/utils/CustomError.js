// server/utils/CustomError.js
class CustomError extends Error {
    /**
     * Constructs a new CustomError instance.
     * @param {string} message - Error message.
     * @param {number} statusCode - HTTP status code.
     */
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true; // Distinguish operational errors from programming errors
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = CustomError;
  