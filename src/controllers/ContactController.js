const { sendContactFormEmail, sendContactConfirmation } = require('../services/emailService');

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
    const { name, email, message, phone } = req.body;
    const errors = [];

    try {
      // Honeypot validation
      if (phone && phone.trim() !== '') {
        // Silently reject the submission without revealing it was a honeypot
        return res.redirect('/contact?success=true');
      }

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

      // Send email instead of saving to database
      await sendContactFormEmail(name, email, message);

      // Send confirmation to the user
      await sendContactConfirmation(name, email);

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