'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  passwordHash: {
    type: String
  },
  profilePhoto: {
    type: String,
    default:
      'https://res.cloudinary.com/dprjjpxak/image/upload/v1596622972/person_wfngle.png'
  },
  confirmationToken: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['active', 'pending'],
    default: 'pending'
  }
});

module.exports = mongoose.model('User', schema);
