// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const crypto = require('crypto');

// Models
const User = require('../models/user');
const RefreshToken = require('../models/RefreshTokens');

// Utilities
const { encrypt, decrypt } = require('../utils/crypto');
const CustomError = require('../utils/CustomError');

// Constants
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

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
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res, next) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new CustomError('Validation failed', 400));
    }

    try {
      const { email, password } = req.body;

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

      // Invalidate existing refresh tokens for the user
      await RefreshToken.deleteMany({ userId: user._id });

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
  }
);

// Export the router containing all authentication routes
module.exports = router;