const User = require('../models/User');

class RegisterController {
  static async submit(req, res) {
    const { firstName, lastName, email, phone, company, role, address, country } = req.body;

    // Validation
    const phoneRegex = /^\+\d{1,3}\d{1,14}$/; // Regex to validate phone number with country code
    const errors = [];

    if (!firstName || !lastName || !email || !phone || !company || !role || !address || !country) {
      errors.push('All fields are required.');
    }

    if (!phoneRegex.test(phone)) {
      errors.push('Phone number must start with a country code (e.g., +1234567890).');
    }

    if (errors.length > 0) {
      // If there are validation errors, render the registration page with errors
      return res.render('pages/register', {
        title: 'Register for Module 1',
        pageTitle: 'Register',
        errors: errors,
      });
    }

    try {
      // Create new user document
      const user = new User({
        firstName,
        lastName,
        email,
        phone,
        company,
        role,
        address,
        country
      });

      // Save to database
      await user.save();

      // Redirect to success page
      res.redirect('/register?success=true');
    } catch (error) {
      console.error('Registration error:', error);
      errors.push('An error occurred during registration. Please try again.');
      res.render('pages/register', {
        title: 'Register for Module 1',
        pageTitle: 'Register',
        errors: errors,
      });
    }
  }
}

module.exports = RegisterController; 