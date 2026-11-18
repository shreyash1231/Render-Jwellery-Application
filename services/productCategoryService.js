const ProductCategory = require("../models/productCategoryModel");
const Product = require("../models/productsModel");
const Category = require("../models/categoriesModal");
const { ErrorResponse } = require("../utils/response");

const idStr = (x) => String(x?._id || x);

const PRODUCT_FIELDS = "name imageUrl categoryId isActive";
const CATEGORY_FIELDS = "name imageUrl parentCategory";

class ProductCategoryService {
  // One row per product that has extra categories: the product (with its main category)
  // and its extra category links, newest products first.
  async getAll() {
    const links = await ProductCategory.find()
      .sort({ createdAt: 1 })
      .populate({
        path: "product",
        select: PRODUCT_FIELDS,
        populate: { path: "categoryId", select: "name" },
      })
      .populate({
        path: "category",
        select: CATEGORY_FIELDS,
        populate: { path: "parentCategory", select: "name" },
      })
      .lean();

    const rows = new Map();
    links.forEach((l) => {
      // Links whose product or category was deleted are skipped
      if (!l.product || !l.category) return;
      const key = idStr(l.product);
      if (!rows.has(key)) rows.set(key, { product: l.product, categories: [], updatedAt: l.updatedAt });
      const row = rows.get(key);
      row.categories.push({ _id: l._id, category: l.category, isActive: l.isActive });
      if (l.updatedAt > row.updatedAt) row.updatedAt = l.updatedAt;
    });

    const data = [...rows.values()].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return { message: "Product categories fetched successfully", data };
  }

  // Extra category links of one product, used to pre-fill the form when it is picked again
  async getForProduct(productId) {
    const links = await ProductCategory.find({ product: productId }).select("category isActive").lean();
    return {
      message: "Product categories fetched successfully",
      data: links.map((l) => ({ _id: l._id, category: l.category, isActive: l.isActive })),
    };
  }

  // Replaces the product's extra categories with the given list. Categories already linked
  // keep their link (and get the status sent); unlisted ones are removed.
  async saveForProduct({ product: productId, categories }) {
    const product = await Product.findById(productId).select("categoryId").lean();
    if (!product) throw new ErrorResponse("The selected product no longer exists", 400);

    // The main category is never stored as an extra one; duplicates are collapsed
    const wanted = new Map();
    categories.forEach((c) => {
      if (idStr(c.category) !== idStr(product.categoryId)) wanted.set(idStr(c.category), c.isActive !== false);
    });

    const ids = [...wanted.keys()];
    const found = await Category.countDocuments({ _id: { $in: ids } });
    if (found !== ids.length) throw new ErrorResponse("One or more selected categories no longer exist", 400);

    await ProductCategory.deleteMany({ product: productId, category: { $nin: ids } });
    if (ids.length) {
      await ProductCategory.bulkWrite(
        ids.map((categoryId) => ({
          updateOne: {
            filter: { product: productId, category: categoryId },
            update: { $set: { isActive: wanted.get(categoryId) } },
            upsert: true,
          },
        }))
      );
    }

    const result = await this.getForProduct(productId);
    return {
      message: ids.length ? "Product categories saved successfully" : "All extra categories removed from this product",
      data: result.data,
    };
  }

  async updateStatus(id, isActive) {
    const link = await ProductCategory.findByIdAndUpdate(id, { isActive }, { new: true });
    if (!link) throw new ErrorResponse("This category link no longer exists", 404);
    return { message: isActive ? "Category activated" : "Category deactivated", data: link };
  }

  async deleteOne(id) {
    const link = await ProductCategory.findByIdAndDelete(id);
    return { message: link ? "Category removed from product" : "Category already removed" };
  }

  async deleteForProduct(productId) {
    const { deletedCount } = await ProductCategory.deleteMany({ product: productId });
    return { message: deletedCount ? "Extra categories removed from product" : "Nothing to remove" };
  }
}

module.exports = new ProductCategoryService();
