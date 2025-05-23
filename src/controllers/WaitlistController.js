const Waitlist = require('../models/Waitlist');
const User = require('../models/User');
const ClassSettings = require('../models/ClassSettings');

class WaitlistController {
  static async showForm(req, res) {
    try {
      const { moduleNumber, programType } = req.query;

      // // Check if the program is full
      // const classSettings = await ClassSettings.findOne({
      //   moduleNumber: moduleNumber || 1,
      //   programType: programType
      // });

      // if (!classSettings) {
      //   return res.redirect('/register');
      // }

      // // Count current confirmed participants
      // const confirmedParticipants = await User.countDocuments({
      //   moduleNumber: moduleNumber || 1,
      //   programType: programType,
      //   paymentStatus: 'completed'
      // });

      // // If the program is not full, redirect to registration
      // if (confirmedParticipants < classSettings.maxParticipants) {
      //   return res.redirect('/register');
      // }

      res.render('pages/waitlist', {
        title: 'Join Waitlist',
        pageTitle: 'Join Waitlist',
        moduleNumber: moduleNumber || 1,
        programType,
        errors: []
      });
    } catch (error) {
      console.error('Waitlist form error:', error);
      res.redirect('/register');
    }
  }

  static async submit(req, res) {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        company,
        role,
        address,
        country,
        nickname
      } = req.body;

      // Honeypot validation
      if (nickname && nickname.trim() !== '') {
        // Silently reject the submission without revealing it was a honeypot
        return res.redirect('/waitlist?success=true');
      }

      // Basic validation
      const errors = [];

      const { moduleNumber, programType } = req.query;

      const classSettings = await ClassSettings.findOne({
        moduleNumber: moduleNumber || 1,
        programType: programType
      });

      // Check for existing user or waitlist entry
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        errors.push('Email already registered');
      }

      const existingWaitlist = await Waitlist.findOne({ email: email.toLowerCase() });
      if (existingWaitlist) {
        errors.push('Email already on waitlist');
      }

      // Validate required fields
      if (!firstName?.trim()) errors.push('First name is required');
      if (!lastName?.trim()) errors.push('Last name is required');
      if (!email?.trim()) errors.push('Email is required');
      if (!phone?.trim()) errors.push('Phone number is required');
      if (!company?.trim()) errors.push('Company name is required');
      if (!role?.trim()) errors.push('Role is required');
      if (!address?.trim()) errors.push('Address is required');
      if (!country?.trim()) errors.push('Country is required');

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
        errors.push('Invalid email format');
      }

      if (errors.length > 0) {
        return res.render('pages/waitlist', {
          title: 'Join Waitlist',
          pageTitle: 'Join Waitlist',
          moduleNumber,
          programType,
          errors
        });
      }

      // Create new waitlist entry
      const waitlistEntry = new Waitlist({
        moduleNumber: parseInt(moduleNumber),
        programType,
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone,
        company,
        role,
        address,
        country
      });

      await waitlistEntry.save();

      res.render('pages/waitlist-success', {
        title: 'Waitlist Registration Successful',
        pageTitle: 'Waitlist Registration Successful',
        moduleNumber,
        programType
      });

    } catch (error) {
      console.error('Waitlist submission error:', error);
      res.render('pages/waitlist', {
        title: 'Join Waitlist',
        pageTitle: 'Join Waitlist',
        moduleNumber: req.body.moduleNumber,
        programType: req.body.programType,
        errors: ['An error occurred during waitlist registration. Please try again.']
      });
    }
  }
}

module.exports = WaitlistController; 