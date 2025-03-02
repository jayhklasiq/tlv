const User = require('../models/User');
const { generatePaymentLink } = require('../config/payment');
const CountryRegistration = require('../models/CountryRegistration');

class RegisterController {
  // Add this new method
  static async checkAvailability(req, res) {
    try {
      const { country, moduleNumber, programType } = req.query;
      
      const countryReg = await CountryRegistration.findOne({
        country: country,
        moduleNumber: parseInt(moduleNumber),
        programType: moduleNumber === '1' ? programType : 'PC'
      });

      const maxParticipants = moduleNumber === '1' && programType === 'TDE' ? 5 : 10;
      const currentParticipants = countryReg ? countryReg.currentParticipants : 0;
      const availableSlots = maxParticipants - currentParticipants;

      res.json({
        available: currentParticipants < maxParticipants,
        totalSlots: maxParticipants,
        currentParticipants: currentParticipants,
        remainingSlots: availableSlots,
        isFull: currentParticipants >= maxParticipants
      });
    } catch (error) {
      console.error('Availability check error:', error);
      res.status(500).json({
        error: 'Failed to check availability'
      });
    }
  }

  static async showForm(req, res) {
    res.render('pages/register', { errors: [], success: false });
  }

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
        country
      } = req.body;

      // Basic validation
      const errors = [];
      // const moduleTemplate = '';

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

      // Check country participant limits
      const countryReg = await CountryRegistration.findOne({
        country: country,
        moduleNumber: parseInt(moduleNumber),
        programType: moduleNumber === '1' ? programType : 'PC'
      });

      const maxParticipants = moduleNumber === '1' && programType === 'TDE' ? 5 : 10;

      if (countryReg && countryReg.currentParticipants >= maxParticipants) {
        return res.render('pages/register', {
          errors: ['Maximum participants reached for this program in your country'],
          success: false
        });
      }

      // Create new user
      const user = new User({
        moduleNumber: parseInt(moduleNumber),
        programType: moduleNumber === '1' ? programType : undefined,
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

      // Update country registration count
      await CountryRegistration.findOneAndUpdate(
        {
          country: country,
          moduleNumber: parseInt(moduleNumber),
          programType: moduleNumber === '1' ? programType : 'PC'
        },
        {
          $inc: { currentParticipants: 1 },
          $setOnInsert: {
            country: country,
            moduleNumber: parseInt(moduleNumber),
            programType: moduleNumber === '1' ? programType : 'PC'
          }
        },
        { upsert: true, new: true }
      );

      // Generate payment link and render success page
      try {
        // Generate Stripe payment link
        const paymentLink = await generatePaymentLink(user);

        // Render success view with payment link
        res.render('pages/registration-success', {
          success: true,
          title: `Module ${moduleNumber} Registration Successful`,
          pageTitle: 'Registration Successful',
          user: savedUser,
          moduleNumber,
          paymentLink,
          moduleTemplate: `module${moduleNumber}`,
          errors: []
        });
      } catch (paymentError) {
        console.error('Payment link generation error:', paymentError);
        // Delete the user if payment link generation fails
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