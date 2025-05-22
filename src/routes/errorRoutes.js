const express = require('express');
const router = express.Router();

// 404 handler
router.use((req, res, next) => {
  res.status(404).render('pages/404', {
    title: 'Page Not Found',
    pageTitle: '404 - Page Not Found'
  });
});

// Global error handler
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/error', {
    title: 'Server Error',
    pageTitle: '500 - Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

module.exports = router; 