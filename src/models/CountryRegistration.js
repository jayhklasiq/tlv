const mongoose = require('mongoose');

const countryRegistrationSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true
  },
  moduleNumber: {
    type: Number,
    required: true,
    enum: [1, 2, 3]
  },
  programType: {
    type: String,
    enum: ['PC', 'TDE']
  },
  currentParticipants: {
    type: Number,
    default: 0
  }
});

// Compound index to ensure unique combination
countryRegistrationSchema.index({ country: 1, moduleNumber: 1, programType: 1 }, { unique: true });

module.exports = mongoose.model('CountryRegistration', countryRegistrationSchema);