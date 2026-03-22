const express = require('express');
const router = express.Router();
const contactController = require("../../controller/adminController/contactController")

router.route("/add-query").post(contactController.createContact);
router.route("/get-all-queries").get(contactController.getAllContacts);
router.route("/get-query/:id").get(contactController.getByIdContact);
router.route("/update-query/:id").patch(contactController.updateContact);
router.route("/delete-query/:id").delete(contactController.deleteContact);

module.exports = router;