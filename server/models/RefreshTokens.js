// server/models/RefreshToken.js
const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  encryptedToken: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Optional: track if the token was revoked manually
  revoked: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
