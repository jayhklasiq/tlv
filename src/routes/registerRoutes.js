const express = require('express');
const router = express.Router();
const RegisterController = require('../controllers/RegisterController');
const User = require('../models/User');
const { generatePaymentLinks } = require('../config/payment');

// GET route for displaying the registration form
router.get('/', (req, res) => {
  res.render('pages/register', {
    title: 'Register for Module 1',
    pageTitle: 'Register',
    errors: []
  });
});

// POST route for handling form submission
router.post('/', RegisterController.submit);

router.get('/payment', async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect('/profile/verify');
    }

    const user = await User.findOne({ email: req.session.user.email });
    if (!user) {
      req.session.destroy();
      return res.redirect('/profile');
    }

    // Generate payment links
    const paymentLinks = await generatePaymentLinks(user);

    // Render payment page
    res.render('pages/registration-success', {
      success: true,
      title: `Module ${user.moduleNumber} Payment`,
      pageTitle: 'Complete Payment',
      user: user,
      moduleNumber: user.moduleNumber,
      paymentLinks,
      moduleTemplate: `module${user.moduleNumber}`,
      errors: []
    });
  } catch (error) {
    console.error('Payment page error:', error);
    res.redirect('/profile');
  }
});

module.exports = router; 