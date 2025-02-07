// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  profilePhoto: { type: String },
  mobile:       { type: String },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
