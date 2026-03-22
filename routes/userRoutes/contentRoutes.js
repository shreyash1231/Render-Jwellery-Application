
const express = require('express');
const router = express.Router();
const staticContentController = require("../../controller/userController/contentController")

router.route("/get-all-content").get(staticContentController.getAllStaticContents);
router.route("/get-content/:id").get(staticContentController.getStaticContentById);

module.exports = router;