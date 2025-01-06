// server/routes/dashboard.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Protected Dashboard Route
router.get('/', auth, (req, res) => {
  res.json({ message: `Welcome User ${req.user.id} to your dashboard.` });
});

module.exports = router;
