const express = require('express');
const expressLayouts = require("express-ejs-layouts");
const path = require('path');
const router = express.Router();
const connectDB = require('./src/config/database');

require('dotenv').config();


// Create an Express application
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

// Set view engine
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

// Routes
const homeRoutes = require('./src/routes/homeRoutes');
const aboutRoutes = require('./src/routes/aboutRoutes');
const contactRoutes = require('./src/routes/contactRoutes');
const moduleRoutes = require('./src/routes/moduleRoutes');
const registerRoutes = require('./src/routes/registerRoutes');

app.use('/', homeRoutes);
app.use('/about', aboutRoutes);
app.use('/contact', contactRoutes);
app.use('/program', moduleRoutes);
app.use('/register', registerRoutes);

// Connect to MongoDB
connectDB();

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Define a port to listen on
const PORT = process.env.PORT || '3500';

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});