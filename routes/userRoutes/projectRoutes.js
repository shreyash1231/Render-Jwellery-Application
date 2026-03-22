const express = require('express');
const router = express.Router();
const projectController = require("../../controller/userController/projectController")

router.route("/get-all-projects").get(projectController.getAllProject);


module.exports = router;