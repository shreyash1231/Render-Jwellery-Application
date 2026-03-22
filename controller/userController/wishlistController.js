const WishlistService = require('../../services/wishlistService');
const asyncHandler = require('../../utils/asyncHandler');
const errorHandler = require('../../middleware/globalErrorHandler');
const successHandler = require('../../middleware/globalSuccessHandler');

const wishlistController = {
  getWishlist: asyncHandler(async (req, res) => {
    const result = await WishlistService.getWishlist(req.user.id);
    return successHandler(res, 200, result.message, result.data);
  }),

  addProduct: asyncHandler(async (req, res) => {
    const { productId } = req.body;
    console.log('user', req.user);
    console.log('prod', productId);

    if (!productId) {
      return errorHandler(
        { statusCode: 400, message: 'productId is required' },
        req,
        res,
      );
    }

    const result = await WishlistService.addProduct(req.user.id, productId);
    return successHandler(res, 200, result.message, result.data);
  }),

  removeProduct: asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const result = await WishlistService.removeProduct(req.user.id, productId);
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = wishlistController;
