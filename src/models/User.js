const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  moduleNumber: {
    type: Number,
    required: true,
    enum: [1]
  },
  programType: {
    type: String,
    enum: ['PC', 'TDE'],
    required: true
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
    default: 'pending',
    required: true
  },
  isConfirmed: {
    type: Boolean,
    default: false,
    validate: {
      validator: function (v) {
        return !v || (v && this.paymentStatus === 'completed');
      },
      message: 'User can only be confirmed when payment status is completed'
    }
  },
  accountExpiry: {
    type: Date,
    default: function () {
      const date = new Date();
      return date.setDate(date.getDate() + 30); // 30 days from creation
    }
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', null],
    default: null
  },
  paymentReference: {
    type: String,
    default: null
  },
  sessionExpiry: {
    type: Date,
    default: function () {
      const date = new Date();
      return date.setHours(date.getHours() + 48); // 45 hours from login
    }
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

userSchema.pre('save', function (next) {
  if (this.isModified('paymentStatus')) {
    if (this.paymentStatus === 'completed') {
      this.isConfirmed = true;
    } else {
      this.isConfirmed = false;
    }
  }
  next();
});

module.exports = mongoose.model('User', userSchema);