const express = require('express');
const propertyController = require('../controllers/propertyController');

const router = express.Router();

router.post('/getAllProperties', propertyController.getAllProperties);
router.get('/getPropertyDetailsByID', propertyController.getPropertyByID);
router.get('/getPropertyAvailabilityByID', propertyController.getPropertyAvailabilityByID);
router.patch('/:id/status', propertyController.updatePropertyStatus); 

module.exports = router;
