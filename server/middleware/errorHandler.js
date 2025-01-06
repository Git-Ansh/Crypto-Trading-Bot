// server/middleware/errorHandler.js
const CustomError = require('../utils/CustomError');

/**
 * Centralized error handling middleware.
 * @param {Error} err - The error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  // If the error is not a CustomError, convert it to one
  if (!(err instanceof CustomError)) {
    err = new CustomError('Internal Server Error', 500);
  }

  // Send the error response
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = errorHandler;
