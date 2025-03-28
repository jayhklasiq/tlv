const express = require('express');
const router = express.Router();
const RegisterController = require('../controllers/RegisterController');
const User = require('../models/User');

// GET route for displaying the registration form
router.get('/', RegisterController.showForm);

// POST route for handling form submission
router.post('/', RegisterController.submit);

module.exports = router;