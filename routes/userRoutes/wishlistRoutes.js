const express = require("express");
const router = express.Router();
const authorize = require("../../middleware/authMiddleware");
const wishlistController = require("../../controller/userController/wishlistController");

router
  .route("/wishlist")
  .get(authorize(["USER"]), wishlistController.getWishlist);
router
  .route("/wishlist")
  .post(authorize(["USER"]), wishlistController.addProduct);
router
  .route("/wishlist")
  .delete(authorize(["USER"]), wishlistController.removeProduct);

module.exports = router;
