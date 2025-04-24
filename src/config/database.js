const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGOURI;

    // Enhanced connection options
    const options = {
      serverSelectionTimeoutMS: 180000, // 3 minutes
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 60000, // 60 seconds
      retryWrites: true,
      retryReads: true,
      maxPoolSize: 10,
      minPoolSize: 5,
    };

    await mongoose.connect(mongoUri, options);
    console.log('MongoDB connected successfully to tlv database');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't exit the process immediately, allow for retry
    throw error;
  }
};

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully');
});

module.exports = connectDB; 