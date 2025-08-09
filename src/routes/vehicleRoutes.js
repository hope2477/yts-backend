const express = require('express');
const vehicleController = require('../controllers/vehicleController');

const router = express.Router();

router.post('/getAllVehicles', vehicleController.getAllVehicleDetails);
router.get('/getVehicleDetailsByID', vehicleController.getVehicleDetailsByID);
router.get('/getVehicleAvailabilityByID', vehicleController.getVehicleAvailabilityByID);
router.patch('/:id/status', vehicleController.updateVehicleStatus);

module.exports = router;
