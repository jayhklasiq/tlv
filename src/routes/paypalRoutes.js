const express = require('express');
const router = express.Router();
const User = require('../models/User');
const path = require('path');
const {
  ApiError,
  Client,
  Environment,
  LogLevel,
  OrdersController,
} = require('@paypal/paypal-server-sdk');

// Initialize PayPal client
const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  },
  timeout: 0,
  environment: process.env.PAYPAL_MODE === 'sandbox' ? Environment.Sandbox : Environment.Production,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
});

const ordersController = new OrdersController(client);

// Create order route
router.post('/orders', async (req, res) => {
  try {
    const { cart } = req.body;
    const { moduleNumber, programType, userId } = cart;

    console.log('PayPal order request:', {
      moduleNumber,
      programType,
      userId
    });

    // Define price configuration similar to Stripe
    const PRICE_CONFIG = {
      1: {
        PC: 500, // $500
        TDE: 1000 // $1000
      },
      2: 500, // $500
      3: 500 // $500
    };

    // Determine the order amount based on module and program type
    let amount;
    const moduleNum = parseInt(moduleNumber);

    if (!PRICE_CONFIG[moduleNum]) {
      throw new Error(`Invalid module number: ${moduleNum}`);
    }

    if (moduleNum === 1) {
      if (!programType || !PRICE_CONFIG[moduleNum][programType]) {
        throw new Error(`Invalid program type for module 1: ${programType}`);
      }
      amount = PRICE_CONFIG[moduleNum][programType];
    } else {
      amount = PRICE_CONFIG[moduleNum];
    }

    console.log('Calculated amount:', amount);

    // Get user info if userId is provided
    let userInfo = { firstName: 'Customer', lastName: '' };
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        userInfo = {
          firstName: user.firstName,
          lastName: user.lastName
        };
      }
    }

    // Create the order with the correct structure for PayPal SDK v2
    const collect = {
      body: {
        intent: "CAPTURE",
        purchaseUnits: [{  // Changed from purchase_units to purchaseUnits
          amount: {
            currencyCode: "USD",  // Changed from currency_code to currencyCode
            value: amount.toString()
          },
          description: `Registration for ${userInfo.firstName} ${userInfo.lastName}`,
          customId: userId || '',  // Changed from custom_id to customId
          invoiceId: `TLV-${Date.now()}-${moduleNum}`  // Changed from invoice_id to invoiceId
        }],
        applicationContext: {  // Changed from application_context to applicationContext
          brandName: "The Leadership Voice",  // Changed from brand_name to brandName
          shippingPreference: "NO_SHIPPING"  // Changed from shipping_preference to shippingPreference
        }
      },
      prefer: "return=representation"
    };

    console.log('PayPal order request body:', JSON.stringify(collect.body, null, 2));

    const { body } = await ordersController.ordersCreate(collect);
    const jsonResponse = JSON.parse(body);
    res.status(201).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order.", message: error.message });
  }
});

// Capture order route
router.post('/orders/:orderID/capture', async (req, res) => {
  try {
    const { orderID } = req.params;
    const collect = {
      id: orderID,
      prefer: "return=representation"
    };

    const { body } = await ordersController.ordersCapture(collect);
    const jsonResponse = JSON.parse(body);

    // Update user payment status if userId is in the order
    try {
      const customId = jsonResponse.purchase_units[0].custom_id;
      if (customId) {
        await User.findByIdAndUpdate(
          customId,
          {
            paymentStatus: 'completed',
            paymentMethod: 'paypal',
            paymentReference: orderID
          },
          { new: true }
        );
      }
    } catch (userUpdateError) {
      console.error("Error updating user payment status:", userUpdateError);
      // Continue with the response even if user update fails
    }

    res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Failed to capture order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});

// Add this route to fetch user payment data by email
router.get('/users/payment-data', async (req, res) => {
  try {
    const userEmail = req.query.email;

    if (!userEmail) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }

    // Fetch user data from the database using email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return only the necessary data for payment processing
    res.json({
      _id: user._id,
      moduleNumber: user.moduleNumber,
      programType: user.programType || '',
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
  } catch (error) {
    console.error('Error fetching user payment data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});
module.exports = router;