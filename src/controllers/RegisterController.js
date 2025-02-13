const User = require('../models/User');

class RegisterController {
  static async submit(req, res) {
    const { firstName, lastName, email, phone, company, role, address, country } = req.body;
    const errors = [];
    const STRIPE_PAYMENT_LINK = process.env.STRIPE_PAYMENT_LINK;

    try {
      // Validation
      const phoneRegex = /^\+\d{1,3}\d{1,14}$/;

      if (!firstName || !lastName || !email || !phone || !company || !role || !address || !country) {
        errors.push('All fields are required.');
      }

      if (!phoneRegex.test(phone)) {
        errors.push('Phone number must start with a country code (e.g., +1234567890).');
      }

      if (errors.length > 0) {
        return res.render('pages/register', {
          title: 'Register for Module 1',
          pageTitle: 'Register',
          errors: errors,
        });
      }

      // Create new user document
      const user = new User({
        firstName,
        lastName,
        email,
        phone,
        company,
        role,
        address,
        country,
        registeredAt: new Date()
      });

      // Save to database
      const savedUser = await user.save();

      if (savedUser) {
        // Redirect to Stripe payment link
        return res.render('pages/register', {
          title: 'Registration Successful',
          pageTitle: 'Success',
          success: true,
          errors: [],
          paymentLink: STRIPE_PAYMENT_LINK
        });
        // Redirect to checkout instead of showing payment link
        // return res.redirect('/create-checkout-session');
      }

    } catch (error) {
      console.error('Registration error:', error);

      if (error.code === 11000) {
        errors.push('This email address is already registered.');
      } else {
        errors.push('An error occurred during registration. Please try again.');   
      }

      res.render('pages/register', {
        title: 'Register for Module 1',
        pageTitle: 'Register',
        errors: errors,
      });
    }
  }
}

module.exports = RegisterController; 