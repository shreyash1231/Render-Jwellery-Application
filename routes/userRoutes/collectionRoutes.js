const express = require("express");
const router = express.Router();
const collectionController = require("../../controller/userController/collectionController");

router.route("/get-home-collections").get(collectionController.getHomeCollections);
router
  .route("/get-collection/:id")
  .get(collectionController.getCollectionById); // id or URL slug

module.exports = router;
