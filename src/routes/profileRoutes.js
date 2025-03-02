const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/ProfileController');
const RegisterController = require('../controllers/RegisterController');

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/profile/verify');
  }
};

router.get('/', ProfileController.index);
router.get('/verify', ProfileController.requestAccess);  // Add this line
router.post('/send-code', ProfileController.sendCode);
router.post('/verify-code', ProfileController.verifyCode);
router.get('/logout', ProfileController.logout);
router.get('/check-availability', RegisterController.checkAvailability);

// Profile update route - protected by authentication
router.post('/update', isAuthenticated, ProfileController.update);

module.exports = router;