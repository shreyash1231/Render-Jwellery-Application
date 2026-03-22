const Cart = require("../models/cartModel");

class CartService {
  async getCartByUser(userId) {
    let cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "name imageUrl quantity sellingPrice mrp",
    }).lean();

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    return {
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    };
  }

  async addItem(userId, productId) {
    // Try to add ONLY if product does not already exist
    const result = await Cart.updateOne(
      {
        userId,
        "items.productId": { $ne: productId }, // 🔑 key condition
      },
      {
        $push: {
          items: { productId, quantity: 1 },
        },
        $set: { updatedAt: new Date() },
      },
    );

    // If nothing was modified → item already exists
    if (result.modifiedCount === 0) {
      const cart = await Cart.findOne({ userId }).lean();

      return {
        success: false,
        message: "Item already exists in the cart",
        data: cart,
      };
    }

    // Item successfully added
    const cart = await Cart.findOne({ userId }).lean();

    return {
      success: true,
      message: "Item added to cart successfully",
      data: cart,
    };
  }

  async updateItem(userId, productId, action) {
    if (!["increase", "decrease"].includes(action)) {
      throw new Error("Invalid action");
    }

    // Get cart WITHOUT populate (very important)
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const index = cart.items.findIndex(
      (i) => i.productId.toString() === productId.toString(),
    );

    if (index === -1) {
      throw new Error("Item not found in cart");
    }

    if (action === "increase") {
      cart.items[index].quantity += 1;
    }

    if (action === "decrease") {
      if (cart.items[index].quantity > 1) {
        cart.items[index].quantity -= 1;
      } else {
        // remove item when quantity reaches 0
        cart.items.splice(index, 1);
      }
    }

    cart.updatedAt = Date.now();
    await cart.save();

    // Populate ONLY for response
    await cart.populate({
      path: "items.productId",
      select: "name price imageUrl quantity",
    });

    return {
      success: true,
      message: `Cart item ${action}d successfully`,
      data: cart,
    };
  }

  async removeItem(userId, productId) {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId.toString(),
    );

    cart.updatedAt = Date.now();
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "name price imageUrl",
    });

    return {
      success: true,
      message: "Item removed from cart successfully",
      data: cart,
    };
  }

  async clearCart(userId) {
    const cartResponse = await this.getCartByUser(userId);
    const cart = cartResponse.data;

    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();

    return {
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    };
  }
}

module.exports = new CartService();
