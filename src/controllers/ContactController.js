const Contact = require('../models/Contact');

class ContactController {
  static index(req, res) {
    res.render('pages/contact', {
      title: 'Contact Us',
      pageTitle: 'Get in Touch',
      success: req.query.success === 'true',
      errors: []
    });
  }

  static async submit(req, res) {
    const { name, email, message } = req.body;
    const errors = [];

    try {
      // Validation
      if (!name || !email || !message) {
        errors.push('All fields are required.');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address.');
      }

      if (errors.length > 0) {
        return res.render('pages/contact', {
          title: 'Contact Us',
          pageTitle: 'Get in Touch',
          errors: errors
        });
      }

      // Create new contact message
      const contact = new Contact({
        name,
        email,
        message
      });

      // Save to database
      await contact.save();

      // Redirect with success message
      res.redirect('/contact?success=true');

    } catch (error) {
      console.error('Contact form error:', error);
      errors.push('An error occurred while sending your message. Please try again.');
      
      res.render('pages/contact', {
        title: 'Contact Us',
        pageTitle: 'Get in Touch',
        errors: errors
      });
    }
  }
}

module.exports = ContactController; 