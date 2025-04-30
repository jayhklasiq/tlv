const express = require('express');
const router = express.Router();
const ModuleController = require('../controllers/ModuleController');

router.get('/module1', ModuleController.module1);
router.get('/power-circle', ModuleController.power_circle);
router.get('/tailored-development', ModuleController.tailored_development);
router.get('/faqs', ModuleController.faqs);

module.exports = router; 