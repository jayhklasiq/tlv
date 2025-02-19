const express = require('express');
const router = express.Router();
const ModuleController = require('../controllers/ModuleController');

router.get('/module1', ModuleController.module1);
router.get('/module2', ModuleController.module2);
router.get('/module3', ModuleController.module3);

module.exports = router; 