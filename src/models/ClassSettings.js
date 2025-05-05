const mongoose = require('mongoose');

const classSettingsSchema = new mongoose.Schema({
  moduleNumber: {
    type: Number,
    required: true
  },
  moduleName: {
    type: String,
    required: true
  },
  programType: {
    type: String,
    enum: ['PC', 'TDE', null],
    default: null
  },
  price: {
    type: Number,
    required: true
  },
  stripePrice: {
    type: Number,
    required: true
  },
  paypalPrice: {
    type: Number,
    required: true
  },
  maxParticipants: {
    type: Number,
    default: 10
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  course1Date: {
    type: Date,
    required: true
  },
  course2Date: {
    type: Date,
    required: true
  },
  course3Date: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add timestamps when the document is updated
classSettingsSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

const ClassSettings = mongoose.model('ClassSettings', classSettingsSchema);

// Initialize with default settings if none exist
const initializeDefaultSettings = async () => {
  try {
    const count = await ClassSettings.countDocuments();
    if (count === 0) {
      const defaults = [
        {
          moduleNumber: 1,
          moduleName: 'Foundations of Leadership Communication',
          programType: 'PC',
          price: 500,
          stripePrice: 50000, // in cents for Stripe
          paypalPrice: 500,
          maxParticipants: 10,
          startDate: new Date('2025-05-29'),
          endDate: new Date('2025-05-31'),
          course1Date: new Date('2025-05-29T14:00:00Z'),
          course2Date: new Date('2025-05-30T14:00:00Z'),
          course3Date: new Date('2025-05-31T14:00:00Z')
        },
        {
          moduleNumber: 1,
          moduleName: 'Foundations of Leadership Communication',
          programType: 'TDE',
          price: 1000,
          stripePrice: 100000, // in cents for Stripe
          paypalPrice: 1000,
          maxParticipants: 5,
          startDate: new Date('2025-05-29'),
          endDate: new Date('2025-05-31'),
          course1Date: new Date('2025-05-29'),
          course2Date: new Date('2025-05-30'),
          course3Date: new Date('2025-05-31')
        },
        {
          moduleNumber: 2,
          moduleName: 'Advanced Leadership Communication',
          programType: null,
          price: 500,
          stripePrice: 50000,
          paypalPrice: 500,
          maxParticipants: 10,
          startDate: new Date('2025-06-29'),
          endDate: new Date('2025-06-30'),
          course1Date: new Date('2025-06-29T14:00:00Z'),
          course2Date: new Date('2025-06-30T14:00:00Z'),
          course3Date: new Date('2025-06-30T16:00:00Z')
        },
        {
          moduleNumber: 3,
          moduleName: 'Leadership Communication Mastery',
          programType: null,
          price: 500,
          stripePrice: 50000,
          paypalPrice: 500,
          maxParticipants: 10,
          startDate: new Date('2025-07-29'),
          endDate: new Date('2025-07-31'),
          course1Date: new Date('2025-07-29T14:00:00Z'),
          course2Date: new Date('2025-07-30T14:00:00Z'),
          course3Date: new Date('2025-07-31T14:00:00Z')
        }
      ];
      
      await ClassSettings.insertMany(defaults);
    }
  } catch (error) {
    console.error('Error initializing default class settings:', error);
  }
};

// Initialize default settings
initializeDefaultSettings();

module.exports = ClassSettings;