// server/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Example: Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  },
  headers: true,
});

module.exports = { limiter, authLimiter };
