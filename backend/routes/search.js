// backend/routes/search.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Note = require('../models/Note');

// Search for users by name or email
router.get('/users', auth, async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ msg: 'Query parameter is required' });
  }
  try {
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    }).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get public notes for a specific user
router.get('/notes/:userId', auth, async (req, res) => {
  try {
    const notes = await Note.find({ author: req.params.userId, isPublic: true }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
