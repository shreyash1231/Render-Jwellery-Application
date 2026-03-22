const Wishlist = require("../models/wishlistModel");

const wishlistPopulateOptions = {
  path: "products",
  select: "name imageUrl quantity sellingPrice mrp",
};

class WishlistService {
  async getOrCreateWishlist(userId) {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, products: [] });
    }

    return wishlist;
  }

  async getWishlist(userId) {
    const wishlist = await this.getOrCreateWishlist(userId);
    await wishlist.populate(wishlistPopulateOptions);

    return {
      success: true,
      message: "Wishlist fetched successfully",
      data: wishlist,
    };
  }

  async addProduct(userId, productId) {
    const wishlist = await this.getOrCreateWishlist(userId);

    const isProductAlreadyAdded = wishlist.products.some(
      (product) => product.toString() === productId.toString()
    );

    if (isProductAlreadyAdded) {
      await wishlist.populate(wishlistPopulateOptions);
      return {
        success: true,
        message: "Product already exists in wishlist",
        data: wishlist,
      };
    }

    wishlist.products.push(productId);
    await wishlist.save();
    await wishlist.populate(wishlistPopulateOptions);

    return {
      success: true,
      message: "Product added to wishlist successfully",
      data: wishlist,
    };
  }

  async removeProduct(userId, productId) {
    const wishlist = await this.getOrCreateWishlist(userId);

    wishlist.products = wishlist.products.filter(
      (product) => product.toString() !== productId.toString()
    );

    await wishlist.save();
    await wishlist.populate(wishlistPopulateOptions);

    return {
      success: true,
      message: "Product removed from wishlist successfully",
      data: wishlist,
    };
  }
}

module.exports = new WishlistService();
