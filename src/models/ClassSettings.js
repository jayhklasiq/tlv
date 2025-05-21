const mongoose = require('mongoose');

const classSettingsSchema = new mongoose.Schema({
  moduleNumber: {
    type: Number,
    required: true,
    enum: [1]  // Only allow Module 1
  },
  moduleName: {
    type: String,
    required: true,
    default: 'Foundations of Leadership Communication'
  },
  programType: {
    type: String,
    enum: ['PC', 'TDE'],
    required: true
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
classSettingsSchema.pre('findOneAndUpdate', function () {
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
          course1Date: new Date('2025-05-29T14:00:00Z'),
          course2Date: new Date('2025-05-30T14:00:00Z'),
          course3Date: new Date('2025-05-31T14:00:00Z')
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