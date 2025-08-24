const express = require('express');
const router = express.Router();
const holidayHomeController = require('../controllers/holidayHomeController');

// Get holiday home availability by ID
router.get('/:id/availability', holidayHomeController.getHolidayHomeAvailabilityByID);

module.exports = router;