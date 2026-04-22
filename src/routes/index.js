const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const exportController = require('../controllers/exportController');

// Dashboard Route
router.get('/', dashboardController.renderDashboard);

// Export Route
router.post('/export', exportController.generateBioLink);

module.exports = router;
