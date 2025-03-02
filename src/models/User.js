const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  moduleNumber: {
    type: Number,
    required: true,
    enum: [1, 2, 3]
  },
  programType: {
    type: String,
    enum: ['PC', 'TDE'],
    required: function () {
      return this.moduleNumber === 1;
    }
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
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
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  accountExpiry: {
    type: Date,
    default: function () {
      const date = new Date();
      return date.setDate(date.getDate() + 30); // 30 days from creation
    }
  }
});

module.exports = mongoose.model('User', userSchema);