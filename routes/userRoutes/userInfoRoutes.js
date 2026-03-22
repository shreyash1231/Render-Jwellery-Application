const express = require("express");
const router = express.Router();
const userInfoController = require("../../controller/userController/userInfoController");

router.route("/add-user-info").post(userInfoController.createUserInfo);

module.exports = router;
