const express = require('express');
const commonController = require('../controllers/commonController');

const router = express.Router();

router.get('/getFeaturedListings', commonController.getAllFeaturedListings);

module.exports = router;