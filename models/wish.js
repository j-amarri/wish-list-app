'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
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
    wishPicture: {
      type: String,
      default: 'https://source.unsplash.com/1600x900/?'
    },
    hasOwnPicture: {
      type: Boolean,
      default: false
    },
    complete: {
      type: Boolean,
      default: false
    },
    experience: {
      type: String,
      minlength: 3,
      maxlength: 280
    },
    rating: {
      type: Number
    },
    public: {
      type: Boolean,
      default: true
    },
    location: {
      coordinates: [
        {
          type: Number,
          min: -180,
          max: 180
        }
      ],
      type: {
        type: String,
        default: 'Point'
      }
    }
  },
  {
    timestamps: true
  }
);

const Wish = mongoose.model('Wish', schema);

module.exports = Wish;
