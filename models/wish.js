'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    minlength: 3,
    maxlength: 200,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    enum: [
      'Travel',
      'Relationship',
      'Career',
      'Financial',
      'Entertainment',
      'Adventure',
      'Contribution',
      'Creativity',
      'Education',
      'Health',
      'Other'
    ],
    default: 'Other'
  },
  private: {
    type: Boolean,
    default: false
  }
});

const Wish = mongoose.model('Wish', schema);

module.exports = Wish;
