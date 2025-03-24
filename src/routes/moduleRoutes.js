const express = require('express');
const router = express.Router();
const ModuleController = require('../controllers/ModuleController');

router.get('/module1', ModuleController.module1);
router.get('/transformative-sessions', ModuleController.transformative);
router.get('/faqs', ModuleController.faqs);

module.exports = router; 