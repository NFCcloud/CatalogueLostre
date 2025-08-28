const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const MenuItem = require('../models/Menu');
const router = express.Router();

// Get all menu items
router.get('/items', async (req, res) => {
  try {
    const items = await MenuItem.findAll({ where: { isActive: true }, order: [['sortOrder', 'ASC']] });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create menu item (admin only)
router.post('/items', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update menu item (admin only)
router.put('/items/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete menu item (admin only)
router.delete('/items/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    await item.destroy();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  res.json(['Δημοφιλέστερα', 'Ορεκτικά', 'Κυρίως Πιάτα', 'Σαλάτες', 'Ποτά', 'Επιδόρπια']);
});

module.exports = router;
