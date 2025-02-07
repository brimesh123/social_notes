// backend/models/Note.js
const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  content:   { type: String },
  images:    [{ type: String }],
  isPublic:  { type: Boolean, default: false },
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', NoteSchema);
