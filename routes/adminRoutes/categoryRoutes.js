const express = require('express');
const router = express.Router();
const categoryController = require('../../controller/adminController/categroyController');
const upload = require('../../middleware/uploadMiddleware');
const { uploadLimiter } = require('../../middleware/rateLimiters');

router
  .route('/add-category')
  .post(
    uploadLimiter,
    upload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
    ]),
    categoryController.createCategory,
  );
router.route('/get-all-category').get(categoryController.getAllCategories);
router.route('/get/:id').get(categoryController.getCategoryById);
router
  .route('/update-category/:id')
  .patch(
    uploadLimiter,
    upload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
    ]),
    categoryController.updateCategory,
  );
router.route('/delete-category/:id').delete(categoryController.deleteCategory);

router
  .route('/get-shop-by-func-categories')
  .get(categoryController.getShopByFuncCategories);

router
  .route('/get-shop-by-prod-categories')
  .get(categoryController.getShopByProdCategories);

module.exports = router;
