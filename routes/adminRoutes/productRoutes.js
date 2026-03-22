const express = require('express');
const router = express.Router();
const productController = require('../../controller/adminController/productController');
const upload = require('../../middleware/uploadMiddleware');
const { uploadLimiter } = require('../../middleware/rateLimiters');

router.route('/add-product').post(uploadLimiter, upload.array('images', 10), productController.createProduct);
router.route('/get-all-products').get(productController.getAllProducts);
router.route('/get/:id').get(productController.getProductById);
router.route('/update-product/:id').patch(uploadLimiter, upload.array('images', 10), productController.updateProduct);
router.route('/delete-product/:id').delete(productController.deleteProduct);
router.route('/delete-product-image/:productId').patch(productController.deleteProductImage);


module.exports = router;
