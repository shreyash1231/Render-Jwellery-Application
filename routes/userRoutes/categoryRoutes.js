const express = require('express');
const router = express.Router();
const categoryController = require('../../controller/userController/categroyController');

router.route('/get-shop-by-func-categories').get(categoryController.getShopByFuncCategories);

router
  .route('/get-shop-by-prod-categories')
  .get(categoryController.getShopByProdCategories);

module.exports = router;
