const express = require("express");
const router = express.Router();
const collectionController = require("../../controller/userController/collectionController");
const validateObjectId = require("../../middleware/validateObjectId");

router.route("/get-home-collections").get(collectionController.getHomeCollections);
router
  .route("/get-collection/:id")
  .get(validateObjectId(), collectionController.getCollectionById);

module.exports = router;
