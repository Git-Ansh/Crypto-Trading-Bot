// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const crypto = require('crypto');

// Apply rate limiting to authentication routes
//router.use('/login', rateLimiter);
//router.use('/register', rateLimiter);

// Models
const User = require('../models/User');
const RefreshToken = require('../models/RefreshTokens');

// AES-256 utility
const { encrypt, decrypt } = require('../utils/crypto');

// Custom Error Class
const CustomError = require('../utils/CustomError');

// Constants
const REFRESH_TOKEN_EXPIRY_DAYS = 7; // how many days refresh tokens last

/**
 * Utility to create a random token string for refresh tokens
 */
function generateRefreshTokenString() {
  return crypto.randomBytes(32).toString('hex');
}

// ============== REGISTER ROUTE ==============
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res, next) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Pass validation errors to error handler
      return next(new CustomError('Validation failed', 400));
    }

    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new CustomError('User already exists', 400);
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      // If the error is not a CustomError, convert it to one
      if (!(error instanceof CustomError)) {
        return next(new CustomError('Server error', 500));
      }
      next(error); // Pass the error to the error handler
    }
  }
);

// ============== LOGIN ROUTE ==============
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate presence of email and password
    if (!email || !password) {
      throw new CustomError('Email and password are required', 400);
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError('Invalid credentials', 400);
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError('Invalid credentials', 400);
    }

    // Create short-lived JWT Access Token
    const accessPayload = { user: { id: user.id } };
    const accessToken = jwt.sign(accessPayload, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Generate and encrypt a refresh token
    const rawRefresh = generateRefreshTokenString();
    const encryptedRefresh = encrypt(rawRefresh);

    // Calculate refresh token expiry
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    // Store encrypted refresh token in DB
    await RefreshToken.create({
      userId: user._id,
      encryptedToken: encryptedRefresh,
      expiresAt: expiry,
    });

    // Set the access token in an HttpOnly cookie
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes in ms
    });

    // Return plaintext refresh token (only once!)
    res.json({
      message: 'Logged in successfully',
      accessToken,
      refreshToken: rawRefresh,
    });
  } catch (error) {
    console.log(error);
    // If the error is not a CustomError, convert it to one
    if (!(error instanceof CustomError)) {
      return next(new CustomError('Server error', 500));
    }
    next(error); // Pass the error to the error handler
  }
});

// ============== REFRESH ROUTE ==============
/**
 * Client sends their plaintext refresh token in the body.
 * We encrypt it, compare with DB, and if valid + not expired,
 * we issue a new access token. Optionally we rotate the refresh token.
 */
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken: rawRefresh } = req.body;
    if (!rawRefresh) {
      throw new CustomError('Missing refresh token', 400);
    }

    // Encrypt the incoming token to compare with DB
    const encryptedRefresh = encrypt(rawRefresh);

    // Find the refresh token doc
    const stored = await RefreshToken.findOne({ token: encryptedRefresh });
    if (!stored) {
      throw new CustomError('Invalid refresh token', 403);
    }

    // Check expiry
    if (stored.expiresAt < new Date()) {
      // Token expired, remove it from DB
      await RefreshToken.deleteOne({ _id: stored._id });
      throw new CustomError('Refresh token expired', 403);
    }

    // The refresh token is valid; create a new Access Token
    const newAccessPayload = { user: { id: stored.user } };
    const newAccessToken = jwt.sign(newAccessPayload, process.env.JWT_SECRET, { expiresIn: '15m' });

    // OPTIONAL: Rotate (generate a new) refresh token to prevent replay
    const newRawRefresh = generateRefreshTokenString();
    const newEncrypted = encrypt(newRawRefresh);

    // Update DB record with new encrypted token + new expiry
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    stored.token = newEncrypted;
    stored.expiresAt = newExpiry;
    await stored.save();

    // Update the access token cookie
    res.cookie('token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Return the new plaintext refresh token + success message
    res.json({
      message: 'Refresh successful',
      refreshToken: newRawRefresh,
    });
  } catch (error) {
    // If the error is not a CustomError, convert it to one
    if (!(error instanceof CustomError)) {
      return next(new CustomError('Server error', 500));
    }
    next(error); // Pass the error to the error handler
  }
});

// ============== LOGOUT ROUTE ==============
/**
 * Clears the access token cookie and also
 * invalidates the refresh token (if provided).
 */
router.post('/logout', async (req, res, next) => {
  try {
    // Clear the access token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Optionally remove the refresh token from DB
    const { refreshToken: rawRefresh } = req.body;
    if (rawRefresh) {
      const encryptedRefresh = encrypt(rawRefresh);
      await RefreshToken.deleteOne({ token: encryptedRefresh });
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    // If the error is not a CustomError, convert it to one
    if (!(error instanceof CustomError)) {
      return next(new CustomError('Server error', 500));
    }
    next(error); // Pass the error to the error handler
  }
});

module.exports = router;
