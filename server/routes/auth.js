// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

// Models
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

// AES-256 utility (replace with your own path if different)
const { encrypt, decrypt } = require('../utils/crypto');

// Constants
const REFRESH_TOKEN_EXPIRY_DAYS = 7; // how many days refresh tokens last

/**
 * Utility to create a random token string for refresh tokens
 */
const crypto = require('crypto');
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
  async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
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
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// ============== LOGIN ROUTE ==============
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
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
      user: user._id,
      token: encryptedRefresh,
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
      refreshToken: rawRefresh,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============== REFRESH ROUTE ==============
/**
 * Client sends their plaintext refresh token in the body.
 * We encrypt it, compare with DB, and if valid + not expired,
 * we issue a new access token. Optionally we rotate the refresh token.
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken: rawRefresh } = req.body;
    if (!rawRefresh) {
      return res.status(400).json({ message: 'Missing refresh token' });
    }

    // Encrypt the incoming token to compare with DB
    const encryptedRefresh = encrypt(rawRefresh);

    // Find the refresh token doc
    const stored = await RefreshToken.findOne({ token: encryptedRefresh });
    if (!stored) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Check expiry
    if (stored.expiresAt < new Date()) {
      // Token expired
      await RefreshToken.deleteOne({ _id: stored._id }); // or you can do stored.remove()
      return res.status(403).json({ message: 'Refresh token expired' });
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
    stored.createdAt = new Date();
    stored.expiresAt = newExpiry;
    await stored.save();

    // Update the access token cookie
    res.cookie('token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    // Return the new plaintext refresh token + success message
    res.json({
      message: 'Refresh successful',
      refreshToken: newRawRefresh,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============== LOGOUT ROUTE ==============
/**
 * Clears the access token cookie and also
 * invalidates the refresh token (if provided).
 */
router.post('/logout', async (req, res) => {
  try {
    // Clear the access token
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
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
