const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

const PRICE_CONFIG = {
  1: {
    PC: {
      amount: 50000, // $500 in cents
      name: 'Leadership Voice Masterclass - Module 1 (PC)',
      maxParticipants: 10
    },
    TDE: {
      amount: 100000, // $1000 in cents
      name: 'Leadership Voice Masterclass - Module 1 (TDE)',
      maxParticipants: 5
    }
  },
  2: {
    amount: 50000, // $500 in cents
    name: 'Leadership Voice Masterclass - Module 2',
    maxParticipants: 10
  },
  3: {
    amount: 50000, // $500 in cents
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
      ? `https://tlv.vercel.app/register`
      : `${process.env.DOMAIN}/register`,
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
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        paymentStatus: 'completed',
        accountExpiry: null
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


const generatePaymentLink = async (user) => {
  try {
    const session = await createCheckoutSession(user);
    return session.url;
  } catch (error) {
    console.error('Payment link generation error:', error);
    throw new Error('Failed to generate payment link');
  }
};

module.exports = {
  createCheckoutSession,
  generatePaymentLink,
  webhookHandler
};