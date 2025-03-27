const User = require('../models/User');
const VerificationCode = require('../models/VerificationCode');
const CountryRegistration = require('../models/CountryRegistration');
const { sendVerificationCode } = require('../services/emailService');

class ProfileController {
  static async index(req, res) {
    try {
      // Check if session exists and has user data
      if (!req.session || !req.session.user) {
        return res.redirect('/profile/verify');
      }

      const user = await User.findOne({ email: req.session.user.email });
      if (!user) {
        // Clear invalid session
        req.session.destroy();
        return res.redirect('/profile');
      }

      res.render('pages/profile', {
        title: 'Course Access',
        pageTitle: 'Course Access',
        user,
        errors: []
      });
    } catch (error) {
      console.error('Profile error:', error);
      res.redirect('/');
    }
  }

  static async requestAccess(req, res) {
    res.render('pages/profile-verify', {
      title: 'Verify Profile Access',
      pageTitle: 'Profile Verification',
      errors: []
    });
  }

  static async sendCode(req, res) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.render('pages/profile-verify', {
          title: 'Verify Profile Access',
          pageTitle: 'Profile Verification',
          errors: ['Email not found in our records']
        });
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await VerificationCode.create({ email, code });
      await sendVerificationCode(email, code);

      res.render('pages/profile-code', {
        title: 'Enter Verification Code',
        pageTitle: 'Enter Code',
        email,
        errors: []
      });
    } catch (error) {
      console.error('Verification error:', error);
      res.render('pages/profile-verify', {
        title: 'Verify Profile Access',
        pageTitle: 'Profile Verification',
        errors: ['Error sending verification code']
      });
    }
  }

  static async verifyCode(req, res) {
    const { email, code, rememberMe } = req.body;

    try {
      const verification = await VerificationCode.findOne({ email, code });
      if (!verification) {
        return res.render('pages/profile-code', {
          title: 'Enter Verification Code',
          pageTitle: 'Enter Code',
          email,
          errors: ['Invalid or expired code']
        });
      }

      const user = await User.findOne({ email });
      await VerificationCode.deleteOne({ email, code });

      // Determine session duration
      const sessionDuration = rememberMe
        ? 30 * 24 * 60 * 60 * 1000  // 30 days
        : 48 * 60 * 60 * 1000;      // 48 hours

      // Store user in session
      req.session.user = {
        email: user.email,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName
      };

      // Update session cookie settings
      req.session.cookie = {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: sessionDuration,
        sameSite: 'strict' // Prevents cross-site session loss
      };

      // Ensure database expiry matches session
      user.sessionExpiry = new Date(Date.now() + sessionDuration);
      await user.save();

      // Save session explicitly
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.redirect('/profile/verify');
        }

        console.log('Session successfully saved:', {
          sessionID: req.session
        });

        res.render('pages/profile', {
          title: 'My Profile',
          pageTitle: 'My Profile',
          user,
          errors: []
        });
      });
    } catch (error) {
      console.error('Verification error:', error);
      res.render('pages/profile-code', {
        title: 'Enter Verification Code',
        pageTitle: 'Enter Code',
        email,
        errors: ['Error verifying code']
      });
    }
  }

  static async update(req, res) {
    try {
      const { firstName, lastName, email, country } = req.body;
      const userId = req.session.user.id || req.session.user._id;
      console.log('Request body from Update:', req.body)


      // Get the user's current data
      const currentUser = await User.findById(userId);
      console.log(currentUser);
      if (!currentUser) {
        req.session.destroy();
        return res.redirect('/profile/verify');
      }

      // Check if any fields actually changed
      const hasChanges =
        currentUser.firstName !== firstName ||
        currentUser.lastName !== lastName ||
        currentUser.email !== email ||
        currentUser.country !== country;

      if (!hasChanges) {
        return res.render('pages/profile', {
          title: 'Profile',
          pageTitle: 'Profile',
          user: currentUser,
          errors: []
        });
      }

      // Update user profile
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { firstName, lastName, email, country },
        { new: true }
      );

      // If country changed, update participant counts
      if (currentUser.country !== country) {
        // Decrease count for old country
        await CountryRegistration.findOneAndUpdate(
          {
            country: currentUser.country,
            moduleNumber: currentUser.moduleNumber,
            programType: currentUser.programType
          },
          { $inc: { currentParticipants: -1 } }
        );

        // Increase count for new country
        await CountryRegistration.findOneAndUpdate(
          {
            country: country,
            moduleNumber: currentUser.moduleNumber,
            programType: currentUser.programType
          },
          { $inc: { currentParticipants: 1 } },
          { upsert: true }
        );
      }

      // Update session with complete user data, maintaining consistency with verifyCode method
      req.session.user = {
        email: updatedUser.email,
        id: updatedUser._id,
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName
      };

      // Extend the session duration
      if (req.session.cookie) {
        const originalMaxAge = req.session.cookie.originalMaxAge || req.session.cookie.maxAge;
        req.session.cookie.maxAge = originalMaxAge;
      }

      // Save the session to persist changes
      req.session.save((err) => {
        if (err) {
          console.error('Session save error after profile update:', err);
        }

        // Log session info for debugging
        console.log('Updated session after profile change:', {
          sessionID: req.sessionID,
          maxAge: req.session.cookie.maxAge,
          user: req.session.user
        });

        return res.render('pages/profile', {
          title: 'Profile',
          pageTitle: 'Profile',
          user: updatedUser,
          success: 'Profile updated successfully!',
          errors: []
        });
      });

    } catch (error) {
      console.error('Profile update error:', error);
      res.render('pages/profile', {
        title: 'Profile',
        pageTitle: 'Profile',
        user: req.session.user,
        errors: ['Failed to update profile. Please try again.']
      });
    }
  }

  static async deleteProfile(req, res) {
    try {
      const userId = req.session.user._id;
      const user = await User.findById(userId);

      // Decrease participant count for the user's country
      await CountryRegistration.findOneAndUpdate(
        {
          country: user.country,
          moduleNumber: user.moduleNumber,
          programType: user.programType
        },
        { $inc: { currentParticipants: -1 } }
      );

      // Delete the user
      await User.findByIdAndDelete(userId);

      // Clear session
      req.session.destroy();

      res.redirect('/');
    } catch (error) {
      console.error('Profile deletion error:', error);
      res.render('pages/profile', {
        title: 'Profile',
        pageTitle: 'Profile',
        user: req.session.user,
        errors: ['Failed to delete profile. Please try again.']
      });
    }
  }

  static async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      res.redirect('/');
    });
  }
}

module.exports = ProfileController;