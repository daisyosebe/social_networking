// Load environment variables from .env file
require('dotenv').config();

const mongoose = require('mongoose');

// Replace with your MongoDB URI from the environment variables or use a default local URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/social-network-api';

// Connection options to avoid deprecation warnings
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to the database
mongoose.connect(MONGODB_URI, options);

// Event listeners for mongoose connection
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${MONGODB_URI}`);
});

mongoose.connection.on('error', (err) => {
  console.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Function to close the Mongoose connection
const gracefulExit = () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection closed through app termination');
    process.exit(0);
  });
};

// Listen for Node.js process signals to close the connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

module.exports = mongoose;
