const Category = require("../models/categoriesModal");
const Product = require("../models/productsModel");
const ProductCategory = require("../models/productCategoryModel");
const CategoryProductOrder = require("../models/categoryProductOrderModel");
const { ErrorResponse } = require("../utils/response");

class CategoryProductOrderService {
  // Every product shown in the category: its main category, or an active Multi Category link
  async memberFilter(categoryId) {
    const extraIds = await ProductCategory.find({ category: categoryId, isActive: true }).distinct("product");
    return { filter: { $or: [{ categoryId }, { _id: { $in: extraIds } }] }, extraIds };
  }

  // Product ids matching `filter` in display order: the admin's saved order first,
  // then the rest (e.g. products added later) newest first.
  async orderedIds(categoryId, filter) {
    const [docs, saved] = await Promise.all([
      Product.find(filter).select("_id").sort({ createdAt: -1 }).lean(),
      CategoryProductOrder.findOne({ category: categoryId }).select("products").lean(),
    ]);
    const ids = docs.map((d) => String(d._id));
    if (!saved?.products?.length) return ids;

    const present = new Set(ids);
    const placed = saved.products.map(String).filter((id) => present.has(id));
    const placedSet = new Set(placed);
    return [...placed, ...ids.filter((id) => !placedSet.has(id))];
  }

  /* ---------- Admin ---------- */
  async getOrder(categoryId) {
    const category = await Category.findById(categoryId).select("name slug").lean();
    if (!category) throw new ErrorResponse("Category not found", 404);

    const { filter, extraIds } = await this.memberFilter(categoryId);
    const [ids, saved] = await Promise.all([
      this.orderedIds(categoryId, filter),
      CategoryProductOrder.findOne({ category: categoryId }).select("products updatedAt").lean(),
    ]);
    const docs = await Product.find({ _id: { $in: ids } })
      .select("name imageUrl sellingPrice mrp isActive quantity categoryId createdAt")
      .populate({ path: "categoryId", select: "name" })
      .lean();
    const byId = new Map(docs.map((d) => [String(d._id), d]));
    const placed = new Set((saved?.products || []).map(String));
    const extra = new Set(extraIds.map(String));

    return {
      success: true,
      message: "Product order fetched successfully",
      data: {
        category,
        hasCustomOrder: placed.size > 0,
        updatedAt: saved?.updatedAt || null,
        products: ids
          .map((id) => byId.get(id))
          .filter(Boolean)
          .map((p) => ({
            ...p,
            // Listed here through Multi Category, not as its main category
            isExtra: extra.has(String(p._id)) && String(p.categoryId?._id || p.categoryId) !== String(categoryId),
            // Not part of the saved order yet (e.g. added after the last save)
            isNew: placed.size > 0 && !placed.has(String(p._id)),
          })),
      },
    };
  }

  // productIds: the full order. An empty list resets the category to newest first.
  async saveOrder(categoryId, productIds) {
    const category = await Category.exists({ _id: categoryId });
    if (!category) throw new ErrorResponse("Category not found", 404);

    if (!productIds.length) {
      await CategoryProductOrder.deleteOne({ category: categoryId });
      return { success: true, message: "Order reset to newest first", data: { hasCustomOrder: false } };
    }

    const { filter } = await this.memberFilter(categoryId);
    const members = await Product.countDocuments({ $and: [filter, { _id: { $in: productIds } }] });
    if (members !== productIds.length) {
      throw new ErrorResponse("Some products are no longer in this category. Reload the page and try again.", 400);
    }

    await CategoryProductOrder.findOneAndUpdate(
      { category: categoryId },
      { products: productIds },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return { success: true, message: "Product order saved", data: { hasCustomOrder: true } };
  }
}

module.exports = new CategoryProductOrderService();
