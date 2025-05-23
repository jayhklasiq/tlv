const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const ClassSettings = require('../models/ClassSettings');
const { registerSuccessMessage, sendPaymentNotification } = require('../services/emailService');

const getPriceConfig = {
  1: {
    PC: {
      amount: 50000, // $150 in cents for Stripe
      name: 'Leadership Voice Masterclass - Module 1 (PC)',
      maxParticipants: 10
    },
    TDE: {
      amount: 100000, // $1000 in cents for Stripe
      name: 'Leadership Voice Masterclass - Module 1 (TDE)',
      maxParticipants: 5
    }
  },
  // 2: {
  //   amount: 50000, // $500 in cents for Stripe
  //   name: 'Leadership Voice Masterclass - Module 2',
  //   maxParticipants: 10
  // },
  // 3: {
  //   amount: 50000, // $500 in cents for Stripe
  //   name: 'Leadership Voice Masterclass - Module 3',
  //   maxParticipants: 10
  // }
};

const createCheckoutSession = async (user) => {
  const moduleNumber = user.moduleNumber;
  const programType = user.programType;

  let moduleConfig = getPriceConfig[moduleNumber];
  if (moduleNumber === 1) {
    moduleConfig = moduleConfig[programType];
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: moduleConfig.name,
            description: `Registration for ${user.firstName} ${user.lastName}`
          },
          unit_amount: moduleConfig.amount
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
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Process the payment
    const email = user.email;
    const username = user.firstName;
    const programType = user.programType;

    // Send registration success email
    await registerSuccessMessage(email, username, programType);

    // Update user information
    const updatedUserData = await User.findByIdAndUpdate(
      userId,
      {
        paymentStatus: 'completed',
        accountExpiry: null,
        paymentMethod: 'stripe',
        paymentReference: session.id
      },
      { new: true }
    );

    // Send notification email to admin
    await sendPaymentNotification(updatedUserData, {
      paymentMethod: 'stripe',
      paymentReference: session.id,
      amount: session.amount_total || (updatedUserData.moduleNumber === 1 && updatedUserData.programType === 'TDE' ? 100000 : 50000)
    });

  } catch (error) {
    console.error('Error updating user payment status:', error);
    throw error;
  }
};

const webhookHandler = async (event) => {
  try {
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
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
  catch (err) {
    console.error(`Error handling webhook:`, err);
  }
};

// This will now get payment links for both Stripe and PayPal
const generatePaymentLinks = async (user) => {
  try {
    const stripeSession = await createCheckoutSession(user);

    return {
      stripe: stripeSession.url,
      // We don't need to generate a PayPal link here as it's handled client-side
      // paypal: '#' // This is a placeholder, the actual PayPal flow is handled by the PayPal SDK
    };
  } catch (error) {
    console.error('Payment link generation error:', error);
    throw new Error('Failed to generate payment links');
  }
};

module.exports = {
  createCheckoutSession,
  generatePaymentLinks,
  webhookHandler,
}