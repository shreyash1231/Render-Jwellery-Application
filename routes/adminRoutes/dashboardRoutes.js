
const express = require('express');
const router = express.Router();
const dashboardController = require("../../controller/adminController/dashboardController")

router.route("/get-dashboard-stats").get(dashboardController.getDashboardStats);

module.exports = router;