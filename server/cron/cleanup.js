const RefreshToken = require('../models/RefreshTokens');

async function removeExpiredTokens() {
  try {
    await RefreshToken.deleteMany({ expiresAt: { $lt: new Date() } });
    console.log('Expired refresh tokens removed');
  } catch (err) {
    console.error('Error removing expired tokens:', err);
  }
}

module.exports = { removeExpiredTokens };
