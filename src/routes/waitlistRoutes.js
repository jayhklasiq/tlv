const express = require('express');
const router = express.Router();
const WaitlistController = require('../controllers/WaitlistController');

// GET route for displaying the waitlist form
router.get('/', WaitlistController.showForm);

// POST route for submitting waitlist form
router.post('/', WaitlistController.submit);

module.exports = router; 