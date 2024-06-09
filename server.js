const express = require('express');
const mongoose = require('./db'); // Ensure the database connection is established
const routes = require('./routes'); // Require the index.js file in the routes folder

const PORT = process.env.PORT || 3009;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes); // Use the routes from the routes/index.js file

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
