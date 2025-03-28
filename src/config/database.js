const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoUri = `${process.env.MONGOURI}/tlv`;
    
    // Set MongoDB connection timeout to three minutes
    mongoose.connect(mongoUri, {serverSelectionTimeoutMS: 180000 });
    console.log('MongoDB connected successfully to tlv database');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 