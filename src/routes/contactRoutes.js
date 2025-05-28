const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/ContactController');

router.get('/', ContactController.index);
// router.post('/submit', ContactController.submit);

module.exports = router;
