const express = require('express');
const router = express.Router();
const RegisterController = require('../controllers/RegisterController');

router.get('/', (req, res) => {
  res.render('pages/register', {
    title: 'Register for Module 1',
    pageTitle: 'Register'
  });
});

router.post('/', RegisterController.submit);

module.exports = router; 