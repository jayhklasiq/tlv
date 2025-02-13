const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async () => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: '500',
        currency: 'usd',
        name: 'Leadership Voice Masterclass'
      },
    ],
    mode: 'payment',
    success_url: `${process.env.DOMAIN}/profile`,
    cancel_url: `${process.env.DOMAIN}`,
  });

  return session;
};

module.exports = createCheckoutSession;