const express = require('express');
const router = express.Router();
const authorize = require('../../middleware/authMiddleware');
const addressController = require('../../controller/userController/addressController');

router.route('/address').get(authorize(['USER']), addressController.getAddresses);
router.route('/address').post(authorize(['USER']), addressController.createAddress);
// router.route('/address').get(authorize(['ADMIN','USER']), addressController.getAddress);
router.route('/address/:id').patch(authorize(['USER']), addressController.updateAddress);
router.route('/address/:id').delete(authorize(['USER']), addressController.deleteAddress);

module.exports = router;
