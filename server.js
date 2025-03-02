const express = require('express');
const expressLayouts = require("express-ejs-layouts");
const path = require('path');
const router = express.Router();
const connectDB = require('./src/config/database');
const stripePayment = require('./src/config/payment');
const { webhookHandler } = require('./src/config/payment');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

require('dotenv').config();

// Create an Express application
const app = express();

// Stripe webhook endpoint - this should be before any body parser middleware
// Update the webhook endpoint
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
const profileRoutes = require('./src/routes/profileRoutes');

app.use('/', homeRoutes);
app.use('/about', aboutRoutes);
app.use('/contact', contactRoutes);
app.use('/program', moduleRoutes);
app.use('/register', registerRoutes);
app.use('/profile', profileRoutes);


// app.post('/create-checkout-session', async (req, res) => {
//   try {
//     const session = await stripePayment.createCheckoutSession();
//     res.redirect(303, session.url);
//   } catch (error) {
//     console.error('Checkout error:', error);
//     res.redirect('/register?error=payment');
//   }
// });

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