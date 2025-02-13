const express = require('express');
const router = express.Router();
const RegisterController = require('../controllers/RegisterController');

// GET route for displaying the registration form
router.get('/', (req, res) => {
  res.render('pages/register', {
    title: 'Register for Module 1',
    pageTitle: 'Register',
    errors: []
  });
});

// POST route for handling form submission
router.post('/', RegisterController.submit);

module.exports = router; 