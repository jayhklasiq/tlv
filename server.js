const express = require('express');
const expressLayouts = require("express-ejs-layouts");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const router = express.Router();
const connectDB = require('./src/config/database');
const stripePayment = require('./src/config/payment');
const { webhookHandler } = require('./src/config/payment');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

require('dotenv').config();

// Create an Express application
const app = express();

// Add session middleware with MongoDB store
app.set('trust proxy', true);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'loggedInUser',
  store: MongoStore.create({
    mongoUrl: process.env.MONGOURI,
    ttl: 30 * 24 * 60 * 60, // 30 days max for remember me
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',  // Ensures cookie persistence
    maxAge: 48 * 60 * 60 * 1000 // Default: 48 hours
  }
}));

// Log session setup
console.log('Session initialized with:', {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 48 * 60 * 60 * 1000
});

// Middleware to extend session on activity
app.use((req, res, next) => {
  // Skip session update for static assets and webhook routes
  if (!req.session || req.originalUrl === '/webhook' || req.originalUrl.startsWith('/src/public')) {
    return next();
  }

  // If user is logged in, extend their session
  if (req.session.user) {
    // Ensure original maxAge is set
    if (!req.session.cookie.originalMaxAge) {
      req.session.cookie.originalMaxAge = req.session.cookie.maxAge || (48 * 60 * 60 * 1000); // Default: 48 hours
    }

    // Reset maxAge to the original value on each request
    req.session.cookie.maxAge = req.session.cookie.originalMaxAge;

    // Refresh session expiration in MongoDB (if stored in DB)
    if (req.sessionStore && req.sessionID) {
      req.sessionStore.get(req.sessionID, (err, sessionData) => {
        if (!err && sessionData) {
          sessionData.cookie.expires = new Date(Date.now() + req.session.cookie.maxAge);
          req.sessionStore.set(req.sessionID, sessionData, (err) => {
            if (err) {
              console.error('Failed to extend session in store:', err);
            }
          });
        }
      });
    }

    // Extend session activity
    req.session.touch();
  }

  next();
});


// Stripe webhook endpoint - MUST BE BEFORE THE JSON BODY PARSER
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Add logging to debug webhook events
    console.log('Webhook event received:', event.type);

    await webhookHandler(event);
    res.json({ received: true });
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Middleware - MUST BE AFTER WEBHOOK ROUTE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

// Setup favicon
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/public/favicon.ico'));
});

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
const profileRoutes = require('./src/routes/profileRoutes');
const paypalRoutes = require('./src/routes/paypalRoutes');

app.use('/', homeRoutes);
app.use('/about', aboutRoutes);
app.use('/contact', contactRoutes);
app.use('/program', moduleRoutes);
app.use('/register', registerRoutes);
app.use('/profile', profileRoutes);
app.use('/api', paypalRoutes);

// Add a route for payment errors
app.get('/payment-error', (req, res) => {
  const errorMessage = req.query.message || 'An unknown error occurred during payment processing';
  res.render('pages/payment-error', {
    errorMessage,
    layout: 'layouts/layout'
  });
});

const paypal_url = process.env.PAYPAL_MODE === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

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