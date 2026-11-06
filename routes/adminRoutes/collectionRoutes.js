const express = require("express");
const router = express.Router();
const collectionController = require("../../controller/adminController/collectionController");
const validateObjectId = require("../../middleware/validateObjectId");

router.route("/create-collection").post(collectionController.createCollection);
router.route("/get-all-collections").get(collectionController.getAllCollections);
router
  .route("/get-collection/:id")
  .get(validateObjectId(), collectionController.getCollectionById);
router
  .route("/update-collection/:id")
  .patch(validateObjectId(), collectionController.updateCollection);
router
  .route("/delete-collection/:id")
  .delete(validateObjectId(), collectionController.deleteCollection);

module.exports = router;
