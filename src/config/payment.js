const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

const PRICE_CONFIG = {
  1: {
    PC: {
      amount: 100, // $150 in cents for Stripe
      name: 'Leadership Voice Masterclass - Module 1 (PC)',
      maxParticipants: 10
    },
    TDE: {
      amount: 100000, // $1000 in cents for Stripe
      name: 'Leadership Voice Masterclass - Module 1 (TDE)',
      maxParticipants: 5
    }
  },
  2: {
    amount: 50000, // $500 in cents for Stripe
    name: 'Leadership Voice Masterclass - Module 2',
    maxParticipants: 10
  },
  3: {
    amount: 50000, // $500 in cents for Stripe
    name: 'Leadership Voice Masterclass - Module 3',
    maxParticipants: 10
  }
};

const createCheckoutSession = async (user) => {
  const moduleNumber = user.moduleNumber;
  const programType = user.programType;

  let priceConfig = PRICE_CONFIG[moduleNumber];
  if (moduleNumber === 1) {
    priceConfig = priceConfig[programType];
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: priceConfig.name,
            description: `Registration for ${user.firstName} ${user.lastName}`
          },
          unit_amount: priceConfig.amount
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: process.env.NODE_ENV === 'production'
      ? `https://tlv.vercel.app/profile?session_id={CHECKOUT_SESSION_ID}`
      : `${process.env.DOMAIN}/profile?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: process.env.NODE_ENV === 'production'
      ? `https://tlv.vercel.app/`
      : `${process.env.DOMAIN}/`,
    metadata: {
      userId: user._id.toString(),
      moduleNumber: moduleNumber.toString(),
      programType: programType || ''
    }
  });

  return session;
};

const handleSuccessfulPayment = async (session) => {
  const { userId } = session.metadata;
  console.log('Processing successful payment for user:', userId);
  try {
    const updatedUser = await User.findById(userId);

    // // Determine the new account expiry based on payment status
    // const newAccountExpiry = updatedUser.paymentStatus === 'pending' ?
    //   null :
    //   new Date(new Date().setDate(new Date().getDate() + 30)); // Set to 30 days from now if pending

    // Update user information
    await User.findByIdAndUpdate(
      userId,
      {
        paymentStatus: 'completed',
        accountExpiry: null, // Set to null if payment is completed
        paymentMethod: 'stripe',
        paymentReference: session.id
      },
      { new: true }
    );
    console.log('Updated user payment status:', updatedUser);
  } catch (error) {
    console.error('Error updating user payment status:', error);
    throw error;
  }
};

const webhookHandler = async (event) => {
  switch (event.type) {
    case 'checkout.session.completed':
      // Handle successful checkout session
      const session = event.data.object;
      await handleSuccessfulPayment(session);
      break;
    case 'payment_intent.succeeded':
      // For payment intent events, we need to fetch the related session
      const paymentIntent = event.data.object;
      if (paymentIntent.metadata.sessionId) {
        const session = await stripe.checkout.sessions.retrieve(paymentIntent.metadata.sessionId);
        await handleSuccessfulPayment(session);
      }
      break;
  }
};

// This will now get payment links for both Stripe and PayPal
const generatePaymentLinks = async (user) => {
  try {
    const stripeSession = await createCheckoutSession(user);

    return {
      stripe: stripeSession.url,
      // We don't need to generate a PayPal link here as it's handled client-side
      paypal: '#' // This is a placeholder, the actual PayPal flow is handled by the PayPal SDK
    };
  } catch (error) {
    console.error('Payment link generation error:', error);
    throw new Error('Failed to generate payment links');
  }
};

// Add the getUserFromSession function
const getUserFromSession = async (req) => {
  if (!req || !req.session || !req.session.user) {
    throw new Error('User is not authenticated');
  }

  // Try to get user by email first (most reliable)
  if (req.session.user.email) {
    const user = await User.findOne({ email: req.session.user.email });
    if (user) {
      console.log('User found by email:', user);
      return user;
    }
  }

  // Fall back to ID if email lookup fails
  const userId = req.session.user.id || req.session.user._id;
  if (!userId) {
    throw new Error('User ID not found in session');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found in database');
  }

  return user;
};

module.exports = {
  createCheckoutSession,
  generatePaymentLinks,
  webhookHandler,
  getUserFromSession
}