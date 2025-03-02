const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/ProfileController');
const RegisterController = require('../controllers/RegisterController');

router.get('/', ProfileController.index);
router.get('/verify', ProfileController.requestAccess);  // Add this line
router.post('/send-code', ProfileController.sendCode);
router.post('/verify-code', ProfileController.verifyCode);
router.get('/logout', ProfileController.logout);
router.get('/check-availability', RegisterController.checkAvailability);
module.exports = router;