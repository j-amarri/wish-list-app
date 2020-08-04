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
    trim: true
  },
  passwordHash: {
    type: String
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
