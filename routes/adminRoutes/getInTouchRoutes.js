const express = require('express');
const router = express.Router();
const getInTouchController = require("../../controller/adminController/getInTouchController")

router.route("/add-detail").post(getInTouchController.createGetInTouch);
router.route("/get-detail").get(getInTouchController.get);
router.route("/update-detail/:id").patch(getInTouchController.updateGetInTouch);
router.route("/delete-detail/:id").delete(getInTouchController.deleteGetInTouch);




module.exports = router;