const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

const PRICE_CONFIG = {
  1: {
    PC: {
      amount: 500000, // $5000 in cents
      name: 'Leadership Voice Masterclass - Module 1 (PC)'
    },
    TDE: {
      amount: 750000, // $7500 in cents
      name: 'Leadership Voice Masterclass - Module 1 (TDE)'
    }
  },
  2: {
    amount: 500000, // $5000 in cents
    name: 'Leadership Voice Masterclass - Module 2'
  },
  3: {
    amount: 500000, // $5000 in cents
    name: 'Leadership Voice Masterclass - Module 3'
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
    success_url: `${process.env.DOMAIN}/profile?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.DOMAIN}/register`,
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
  // console.log('Processing successful payment for user:', userId);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        paymentStatus: 'completed',
        accountExpiry: null
      },
      { new: true }
    );
    // console.log('Updated user payment status:', updatedUser);
  } catch (error) {
    console.error('Error updating user payment status:', error);
    throw error;
  }
};

const webhookHandler = async (event) => {
  switch (event.type) {
    case 'payment_intent.succeeded':
      const session = event.data.object;
      // console.log(session);
      await handleSuccessfulPayment(session);
      break;
  }
};

const generatePaymentLink = async (user) => {
  try {
    const session = await createCheckoutSession(user);
    return session.url;
  } catch (error) {
    // console.error('Payment link generation error:', error);
    throw new Error('Failed to generate payment link');
  }
};

module.exports = {
  createCheckoutSession,
  generatePaymentLink,
  webhookHandler
};