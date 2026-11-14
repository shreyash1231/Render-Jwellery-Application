const Wishlist = require("../models/wishlistModel");
const discountService = require("./discountService");

const wishlistPopulateOptions = {
  path: "products",
  select: "name imageUrl quantity sellingPrice mrp categoryId",
};

// Plain copy of the populated wishlist with live offer prices on its products
const withOffers = async (wishlist) => {
  const data = wishlist.toObject ? wishlist.toObject() : wishlist;
  await discountService.applyOffers(data.products);
  return data;
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
      data: await withOffers(wishlist),
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
        data: await withOffers(wishlist),
      };
    }

    wishlist.products.push(productId);
    await wishlist.save();
    await wishlist.populate(wishlistPopulateOptions);

    return {
      success: true,
      message: "Product added to wishlist successfully",
      data: await withOffers(wishlist),
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
      data: await withOffers(wishlist),
    };
  }
}

module.exports = new WishlistService();
