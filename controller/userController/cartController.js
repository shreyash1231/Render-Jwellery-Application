const CartService = require("../../services/cartService");
const {
  addItemSchema,
  updateItemSchema,
} = require("../../validation/cartValidation");
const asyncHandler = require("../../utils/asyncHandler");
const validationError = require("../../utils/validationError");
const errorHandler = require("../../middleware/globalErrorHandler");
const successHandler = require("../../middleware/globalSuccessHandler");

const cartController = {
  getCart: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await CartService.getCartByUser(userId);
    return successHandler(res, 200, result.message, result.data);
  }),

  addItem: asyncHandler(async (req, res) => {
    const { error, value } = addItemSchema.validate(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res
      );
    }

    const userId = req.user.id;
    const result = await CartService.addItem(
      userId,
      value.productId
    );
    return successHandler(res, 200, result.message, result.data);
  }),

  updateItem: asyncHandler(async (req, res) => {
    const { error, value } = updateItemSchema.validate(req.body);
    if (error) {
      return errorHandler(
        { statusCode: 400, message: validationError(error) },
        req,
        res
      );
    }

    const userId = req.user.id;
    const result = await CartService.updateItem(
      userId,
      value.productId,
      value.action
       );
    return successHandler(res, 200, result.message, result.data);
  }),

  removeItem: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;
    const result = await CartService.removeItem(userId, productId);
    return successHandler(res, 200, result.message, result.data);
  }),

  clearCart: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await CartService.clearCart(userId);
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = cartController;
