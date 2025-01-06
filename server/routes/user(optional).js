// server/routes/user.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const CustomError = require('../utils/CustomError');
const User = require('../models/User');
const { encrypt, decrypt } = require('../utils/crypto');

// Update Profile Route
router.put(
  '/profile',
  [
    check('username', 'Username is required').optional().not().isEmpty(),
    check('email', 'Please include a valid email').optional().isEmail(),
    check('secretNote', 'Secret Note must be a string').optional().isString(),
  ],
  async (req, res, next) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new CustomError('Validation failed', 400));
    }

    try {
      const { username, email, secretNote } = req.body;

      // Build update object
      const updateFields = {};
      if (username) updateFields.username = username;
      if (email) updateFields.email = email;
      if (secretNote) updateFields.secretNote = encrypt(secretNote);

      // Update user in DB
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updateFields },
        { new: true }
      );

      res.json({
        message: 'Profile updated successfully',
        user: {
          username: updatedUser.username,
          email: updatedUser.email,
          secretNote: updatedUser.getSecretNote(), // Decrypted note
        },
      });
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate email error
        return next(new CustomError('Email already in use', 400));
      }
      next(error);
    }
  }
);

module.exports = router;
