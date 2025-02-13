const User = require('../models/User');
const VerificationCode = require('../models/VerificationCode');
const { sendVerificationCode } = require('../services/emailService');

class ProfileController {
  static async index(req, res) {
    try {
      // In a real application, you'd get the user ID from the session
      // For now, we'll just render the profile page
      res.render('pages/profile', {
        title: 'My Profile',
        pageTitle: 'My Profile',
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
    const { email, code } = req.body;
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

      res.redirect('/profile');

      // res.render('pages/profile', {
      //   title: 'My Profile',
      //   pageTitle: 'My Profile',
      //   user,
      //   errors: []
      // });
    } catch (error) {
      console.error('Code verification error:', error);
      res.render('pages/profile-code', {
        title: 'Enter Verification Code',
        pageTitle: 'Enter Code',
        email,
        errors: ['Error verifying code']
      });
    }
  }
}

module.exports = ProfileController; 