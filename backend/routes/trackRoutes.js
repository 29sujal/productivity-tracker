const express = require('express');
const router = express.Router();
const Track = require('../models/Track');

// Save time spent on a website
router.post('/', async (req, res) => {
  try {
    const { url, duration } = req.body;
    const track = new Track({ url, duration });
    await track.save();
    res.status(201).json({ message: 'Tracked successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save tracking data' });
  }
});

// Get all tracked records (optional)
router.get('/report', async (req, res) => {
  try {
    const data = await Track.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

module.exports = router;
