const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const MenuItem = require('../models/Menu');
const User = require('../models/User');
const router = express.Router();

// Get statistics (admin only)
router.get('/statistics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const menuCount = await MenuItem.count();
    const userCount = await User.count();
    res.json({ menuCount, userCount });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
