
const express = require('express');
const router = express.Router();
const staticContentController = require("../../controller/adminController/contentController")

router.route("/add-content").post(staticContentController.createStaticContent);
router.route("/get-all-content").get(staticContentController.getAllStaticContents);
router.route("/get-content/:id").get(staticContentController.getStaticContentById);
router.route("/update-content/:id").patch(staticContentController.updateStaticContent);
router.route("/delete-content/:id").delete(staticContentController.deleteStaticContent);
router.route("/toogle").patch(staticContentController.toggleStatus);
router.route("/get-content-by-type/:type").get(staticContentController.createStaticContent);

module.exports = router;