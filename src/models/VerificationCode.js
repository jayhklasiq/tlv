const mongoose = require('mongoose');

const verificationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // Code expires after 10 minutes
  }
}, { collection: 'verification_codes' });

module.exports = mongoose.model('VerificationCode', verificationCodeSchema); 