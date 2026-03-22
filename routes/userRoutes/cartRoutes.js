const express = require("express");
const router = express.Router();
const authorize = require("../../middleware/authMiddleware");
const cartController = require("../../controller/userController/cartController");

router.route("/cart").get(authorize(["USER"]), cartController.getCart);
router.route("/cart/add").post(authorize(["USER"]), cartController.addItem);
router
  .route("/cart/update")
  .patch(authorize(["USER"]), cartController.updateItem);
router
  .route("/cart/remove/:productId")
  .delete(authorize(["USER"]), cartController.removeItem);
router
  .route("/cart/clear")
  .delete(authorize(["USER"]), cartController.clearCart);

module.exports = router;
