const express = require('express');
const router = express.Router();
const getInTouchController = require("../../controller/userController/getInTouchController")

router.route("/get-in-touch").get(getInTouchController.get);





module.exports = router;