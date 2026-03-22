const express = require('express');
const router = express.Router();
const contactController = require("../../controller/userController/contactController")

router.route("/add-query").post(contactController.createContact);

module.exports = router;