const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.isAdmin) {
    return next();
  }
  return res.redirect('/profile?error=You must be an admin to access this page');
};

// Admin routes
router.get('/', AdminController.dashboard);
router.get('/dashboard', isAdmin, AdminController.dashboard);
router.get('/class-settings', isAdmin, AdminController.classSettings);
router.post('/class-settings', isAdmin, AdminController.updateClassSettings);
router.get('/class-settings/delete/:id', isAdmin, AdminController.deleteClassSetting);
router.get('/enrollments', isAdmin, AdminController.enrollments);

module.exports = router;