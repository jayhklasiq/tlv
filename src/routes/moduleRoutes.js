const express = require('express');
const router = express.Router();
const ModuleController = require('../controllers/ModuleController');

router.get('/', ModuleController.index);

module.exports = router; 