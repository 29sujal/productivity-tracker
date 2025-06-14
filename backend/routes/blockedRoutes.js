const express = require('express');
const router = express.Router();
const BlockedSite = require('../models/BlockedSite');

// Normalize helper (same as frontend logic)
function normalizeSite(site) {
  return site
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .toLowerCase()
    .split('/')[0];
}

// POST - block a site
router.post('/', async (req, res) => {
  try {
    const { site } = req.body;
    const normalized = normalizeSite(site);

    const existing = await BlockedSite.findOne({ site: { $regex: new RegExp(`^${normalized}$`, 'i') } });
    if (existing) return res.status(409).json({ message: 'Already blocked' });

    const block = new BlockedSite({ site: normalized });
    await block.save();
    res.status(201).json({ message: '✅ Site blocked' });
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to block site' });
  }
});

// GET - all blocked sites
router.get('/', async (req, res) => {
  try {
    const list = await BlockedSite.find().sort({ addedAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to fetch blocked sites' });
  }
});

// ✅ DELETE - unblock a site
router.delete('/:site', async (req, res) => {
  try {
    const raw = decodeURIComponent(req.params.site);
    const normalized = normalizeSite(raw);

    await BlockedSite.deleteMany({
      site: { $regex: new RegExp(normalized.replace(/\./g, '\\.'), 'i') },
    });

    res.json({ message: '✅ Site unblocked' });
  } catch {
    res.status(500).json({ error: '❌ Failed to unblock site' });
  }
});

module.exports = router;
