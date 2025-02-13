const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/ProfileController');

router.get('/', ProfileController.requestAccess);
router.post('/send-code', ProfileController.sendCode);
router.post('/verify-code', ProfileController.verifyCode);

module.exports = router; 