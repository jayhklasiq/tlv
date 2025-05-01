// const mongoose = require('mongoose');
// require('dotenv').config();

// const connectDB = async () => {
//   try {
//     const mongoUri = process.env.MONGOURI;

//     // Enhanced connection options
//     const options = {
//       serverSelectionTimeoutMS: 180000, // 3 minutes
//       socketTimeoutMS: 45000, // 45 seconds
//       connectTimeoutMS: 60000, // 60 seconds
//       retryWrites: true,
//       retryReads: true,
//       maxPoolSize: 10,
//       minPoolSize: 5,
//     };

//     await mongoose.connect(mongoUri, options);
//     console.log('MongoDB connected successfully to tlv database');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     // Don't exit the process immediately, allow for retry
//     throw error;
//   }
// };

// // Handle connection events
// mongoose.connection.on('error', (err) => {
//   console.error('MongoDB connection error:', err);
// });

// mongoose.connection.on('disconnected', () => {
//   console.log('MongoDB disconnected. Attempting to reconnect...');
// });

// mongoose.connection.on('reconnected', () => {
//   console.log('MongoDB reconnected successfully');
// });

// module.exports = connectDB;

const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
	try {
		// Check if environment variable is actually loaded
		const mongoUri = process.env.MONGOURI;
		if (!mongoUri) {
			throw new Error("MONGOURI environment variable is not defined");
		}
		console.log("Attempting to connect with extended timeouts...");
		// Enhanced connection options
		const options = {
			serverSelectionTimeoutMS: 300000, // 5 minutes
			socketTimeoutMS: 120000, // 2 minutes
			connectTimeoutMS: 60000, // 60 seconds
			retryWrites: true,
			retryReads: true,
			maxPoolSize: 10,
			minPoolSize: 5,
		};
		// Log the options being used (don't log the full URI for security)
		console.log("Using connection options:", JSON.stringify(options));
		await mongoose.connect(mongoUri, options);
		console.log("MongoDB connected successfully to tlv database");
	} catch (error) {
		console.error("MongoDB connection error type:", error.name);
		console.error("MongoDB connection error message:", error.message);
		throw error;
	}
}; // Handle connection events
mongoose.connection.on("error", (err) => {
	console.error("MongoDB connection error:", err);
});
mongoose.connection.on("disconnected", () => {
	console.log("MongoDB disconnected. Attempting to reconnect...");
});
mongoose.connection.on("reconnected", () => {
	console.log("MongoDB reconnected successfully");
});
//Add process termination handlers
process.on("SIGINT", async () => {
	await mongoose.connection.close();
	console.log("MongoDB connection closed due to app termination");
	process.exit(0);
});
module.exports = connectDB;
