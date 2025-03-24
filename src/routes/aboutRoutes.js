const express = require('express');
const router = express.Router();

// Main about page
router.get('/', (req, res) => {
  res.render('pages/about', {
    title: 'About Us',
    layout: 'layouts/layout'
  });
});

// Our Purpose page
router.get('/purpose', (req, res) => {
  res.render('pages/purpose', {
    title: 'Our Purpose',
    layout: 'layouts/layout'
  });
});

// The Experience page
router.get('/experience', (req, res) => {
  res.render('pages/experience', {
    title: 'The Experience',
    layout: 'layouts/layout'
  });
});

module.exports = router; 