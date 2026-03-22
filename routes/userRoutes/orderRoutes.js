const express = require('express');
const router = express.Router();
const authorize = require('../../middleware/authMiddleware');
const optionalAuthorize = require('../../middleware/optionalAuthMiddleware');
const orderController = require('../../controller/userController/orderController');

router.route('/get-all-orders').get(authorize(['USER']), orderController.getOrder);
router.route('/order/create').post(optionalAuthorize, orderController.createOrder);
router.route('/orders/me').get(authorize(['USER']), orderController.getUserOrders);


module.exports = router;
