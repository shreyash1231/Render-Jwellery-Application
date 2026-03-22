const express = require("express");
const router = express.Router();
const userInfoController = require("../../controller/adminController/userInfoController");

router.route("/get-user-info").get(userInfoController.getAllUserInfo);

module.exports = router;
