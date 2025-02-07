const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET /api/profile
// Retrieve the current user's profile (excluding the password)
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT /api/profile
// Update the current user's profile. This route now accepts a passkey value.
router.put('/', auth, async (req, res) => {
  // Destructure the fields from the request body
  const { name, mobile, profilePhoto, passkey } = req.body;
  const profileFields = {};
  if (name) profileFields.name = name;
  if (mobile) profileFields.mobile = mobile;
  if (profilePhoto) profileFields.profilePhoto = profilePhoto;
  // Update passkey only if it is provided (even an empty string may be intended to clear it)
  if (passkey !== undefined) profileFields.passkey = passkey;
  
  try {
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

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
});

module.exports = router;
