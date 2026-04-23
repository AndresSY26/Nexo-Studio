const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const exportController = require('../controllers/exportController');

// Landing Page Route
router.get('/', dashboardController.renderHome);

// Dashboard / Editor Route
router.get('/create', dashboardController.renderDashboard);

// Export Route
router.post('/export', exportController.generateBioLink);

module.exports = router;
