const express = require('express');
const inquiryController = require('../controllers/inquiryController');

const router = express.Router();

router.post('/contactDetails', inquiryController.sendContactUsDetails);
router.post('/inquiryDetails', inquiryController.sendInquiryDetails);

module.exports = router;