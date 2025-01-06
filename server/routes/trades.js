// server/routes/trades.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Trade = require('../models/Trade'); // Assuming you have a Trade model

// Get User's Trades
router.get('/', auth, async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user.id });
    res.json(trades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a New Trade
router.post('/', auth, async (req, res) => {
  try {
    const { type, amount, symbol } = req.body;

    const newTrade = new Trade({
      user: req.user.id,
      type, // 'buy' or 'sell'
      amount,
      symbol,
      timestamp: Date.now(),
    });

    const trade = await newTrade.save();
    res.status(201).json(trade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
