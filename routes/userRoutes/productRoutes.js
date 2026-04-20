const express = require('express');
const router = express.Router();
const productController = require('../../controller/userController/productController');
const upload = require('../../middleware/uploadMiddleware');
const { uploadLimiter } = require('../../middleware/rateLimiters');

router.route('/get-all-products').get(productController.getAllProducts);
router.route('/get-product-by-id/:id').get(productController.getProductById);
router.get("/get-all-shoptolook", productController.getAllShoptolook);
router.route('/get-bestSeller-products').get(productController.getbestSellerProducts);
module.exports = router;
