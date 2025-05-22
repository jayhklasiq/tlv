const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: [
      'Board Chairperson',
      'Chief Executive Officer',
      'Chief Financial Officer',
      'Chief Marketing Officer',
      'Chief Operating Officer',
      'Chief Strategy Officer',
      'Chief Technology Officer',
      'Co-Founder',
      'Director',
      'Executive Director',
      'Founder',
      'General Manager',
      'Managing Director',
      'President',
      'Vice President'
    ]
  },
  address: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'notified', 'registered'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Waitlist', waitlistSchema); 