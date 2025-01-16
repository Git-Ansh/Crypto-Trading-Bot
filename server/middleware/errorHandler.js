// server/middleware/errorHandler.js
const CustomError = require("../utils/CustomError");

/**
 * Centralized error handling middleware.
 * @param {Error} err - The error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// errorHandler.js
const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Fallback
  res.status(500).json({
    success: false,
    message: "Server Error",
  });
};
module.exports = errorHandler;
