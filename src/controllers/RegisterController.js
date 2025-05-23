const User = require('../models/User');
const { generatePaymentLinks } = require('../config/payment');
const WaitlistController = require('../controllers/WaitlistController');
const ClassSettings = require('../models/ClassSettings');

class RegisterController {
  // Reusable function for availability logic
  static async getAvailability(moduleNumber, programType) {
    try {
      // Get the class settings for the program
      const classSettings = await ClassSettings.findOne({
        moduleNumber: parseInt(moduleNumber),
        programType: programType
      });

      if (!classSettings) {
        throw new Error('Class settings not found');
      }

      // Count only confirmed (paid) participants
      const confirmedParticipants = await User.countDocuments({
        moduleNumber: parseInt(moduleNumber),
        programType: programType,
        paymentStatus: 'completed'
      });

      const maxParticipants = classSettings.maxParticipants;
      const availableSlots = maxParticipants - confirmedParticipants;

      return {
        available: confirmedParticipants < maxParticipants,
        totalSlots: maxParticipants,
        currentParticipants: confirmedParticipants,
        remainingSlots: availableSlots,
        isFull: confirmedParticipants >= maxParticipants
      };
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  }

  static async checkAvailability(req, res) {
    try {
      const { moduleNumber, programType } = req.query;
      const result = await RegisterController.getAvailability(moduleNumber, programType);
      res.json(result);
    } catch (error) {
      console.error('Availability check error:', error);
      res.status(500).json({
        error: 'Failed to check availability'
      });
    }
  }

  static async showForm(req, res) {
    // res.render('pages/register', {
    //   title: 'Register for Module 1',
    //   pageTitle: 'Register',
    //   errors: []
    // });
    return WaitlistController.showForm(req, res);
  };

  static async submit(req, res) {
    try {
      const {
        moduleNumber,
        programType,
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
        return res.redirect('/register?success=true');
      }

      // Basic validation
      const errors = [];
      // Validate moduleNumber and programType combination
      if (parseInt(moduleNumber) === 1 && !programType) {
        errors.push('Program Type is required for Module 1');
      }
      // Validate role is in allowed list
      const allowedRoles = [
        'Board Chairperson',
        'Chief Executive Officer',
        'Chief Financial Officer',
        'Chief Marketing Officer',
        'Chief Operating Officer',
        'Chief Strategy Officer',
        'Chief Technology Officer',
        'Co-Founder',
        'Director',
        'Executive Director',
        'Founder',
        'General Manager',
        'Managing Director',
        'President',
        'Vice President'
      ];
      if (!allowedRoles.includes(role)) {
        errors.push('Invalid role selected');
      }
      // Check for existing user
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        errors.push('Email already registered');
      }
      if (errors.length > 0) {
        return res.render('pages/register', { errors, success: false });
      }

      // Use the shared availability logic
      const availability = await RegisterController.getAvailability(moduleNumber, programType);
      if (!availability.available) {
        // Redirect to waitlist instead of showing error
        return res.redirect(`/waitlist?moduleNumber=${moduleNumber}${programType ? `&programType=${programType}` : ''}`);
      }

      // Create new user
      const user = new User({
        moduleNumber: parseInt(moduleNumber),
        programType: programType,
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone,
        company,
        role,
        address,
        country
      });

      // Save to database
      const savedUser = await user.save();

      // Generate payment link and render success page
      try {
        const paymentLinks = await generatePaymentLinks(user);
        res.render('pages/registration-success', {
          success: true,
          title: `Module ${moduleNumber} Registration Successful`,
          pageTitle: 'Registration Successful',
          user: savedUser,
          moduleNumber: savedUser.moduleNumber,
          paymentLinks,
          moduleTemplate: `module${moduleNumber}`,
          errors: []
        });
      } catch (paymentError) {
        console.error('Payment link generation error:', paymentError);
        await User.findByIdAndDelete(user._id);
        throw new Error('Payment link generation failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      res.render('pages/register', {
        errors: ['An error occurred during registration. Please try again.'],
        success: false
      });
    }
  }
}

module.exports = RegisterController;