// backend/routes/profile.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/profile
// @desc    Get current user profile
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/',
  [
    auth,
    // Optionally add validation for mobile or other fields
    check('mobile', 'Mobile number is required').optional().not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, mobile, profilePhoto } = req.body;
    const profileFields = {};
    if (name) profileFields.name = name;
    if (mobile) profileFields.mobile = mobile;
    if (profilePhoto) profileFields.profilePhoto = profilePhoto;
    
    try {
      let user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      
      user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: profileFields },
        { new: true }
      ).select('-password');
      
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
