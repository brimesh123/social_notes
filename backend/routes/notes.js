// backend/routes/notes.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Note = require('../models/Note');

// @route   GET /api/notes
// @desc    Get all notes for the authenticated user (optionally filtered by search query)
// @access  Private
router.get('/', auth, async (req, res) => {
  const search = req.query.search;
  try {
    let query = { author: req.user.id };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post(
  '/',
  [
    auth,
    check('title', 'Title is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { title, content, images, isPublic } = req.body;
    
    try {
      const newNote = new Note({
        title,
        content,
        images,
        isPublic: isPublic || false,
        author: req.user.id
      });
      
      const note = await newNote.save();
      res.json(note);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, content, images, isPublic } = req.body;
  
  // Build note object
  const noteFields = {};
  if (title) noteFields.title = title;
  if (content) noteFields.content = content;
  if (images) noteFields.images = images;
  if (typeof isPublic !== 'undefined') noteFields.isPublic = isPublic;
  
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }
    
    // Ensure the user owns the note
    if (note.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: noteFields },
      { new: true }
    );
    
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }
    
    // Ensure the user owns the note
    if (note.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Use findByIdAndDelete instead of findByIdAndRemove
    await Note.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Note removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
