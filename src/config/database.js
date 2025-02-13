const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoUri = `${process.env.MONGOURI}/tlv`;
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully to tlv database');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 