const Collection = require("../models/collectionModel");
const Category = require("../models/categoriesModal");
const Product = require("../models/productsModel");
const { ErrorResponse } = require("../utils/response");

const POPULATE = [
  { path: "items.category", select: "name imageUrl" },
  { path: "items.products", select: "name imageUrl sellingPrice mrp categoryId" },
];

// Drop references to categories/products that were deleted after the collection was saved
const clean = (collection) => {
  if (!collection) return collection;
  const c = collection.toObject ? collection.toObject() : collection;
  c.items = (c.items || [])
    .filter((item) => item.category)
    .map((item) => ({ ...item, products: (item.products || []).filter(Boolean) }));
  return c;
};

// Storefront: full product data (the cart and product cards need it), active products only
const STOREFRONT_POPULATE = [
  { path: "items.category", select: "name" },
  { path: "items.products", match: { isActive: true }, select: "-faqs" },
];

const storefrontProducts = (collection) =>
  (collection.items || [])
    .filter((item) => item.category)
    .flatMap((item) => (item.products || []).filter(Boolean));

class CollectionService {
  async assertTitleAvailable(title, exceptId) {
    if (!title) return;
    const existing = await Collection.findOne({ title: title.trim() })
      .collation({ locale: "en", strength: 2 })
      .select("_id")
      .lean();
    if (existing && String(existing._id) !== String(exceptId)) {
      throw new ErrorResponse(`A collection named "${title.trim()}" already exists`, 409);
    }
  }

  // Every category must exist and every product must belong to the category it is listed under
  async assertItemsValid(items) {
    if (!items) return;
    const categoryIds = items.map((i) => i.category);
    const found = await Category.countDocuments({ _id: { $in: categoryIds } });
    if (found !== categoryIds.length) {
      throw new ErrorResponse("One of the selected categories no longer exists", 400);
    }

    const productIds = items.flatMap((i) => i.products);
    const products = await Product.find({ _id: { $in: productIds } })
      .select("name categoryId")
      .lean();
    const byId = Object.fromEntries(products.map((p) => [String(p._id), p]));

    for (const item of items) {
      for (const id of item.products) {
        const p = byId[id];
        if (!p) throw new ErrorResponse("One of the selected products no longer exists", 400);
        if (String(p.categoryId) !== String(item.category)) {
          throw new ErrorResponse(`"${p.name}" is not in the category it was selected under`, 400);
        }
      }
    }
  }

  async createCollection(data) {
    await this.assertTitleAvailable(data.title);
    await this.assertItemsValid(data.items);
    const created = await Collection.create(data);
    const collection = await Collection.findById(created._id).populate(POPULATE);

    return {
      success: true,
      message: "Collection created successfully",
      data: clean(collection),
    };
  }

  async getAllCollections() {
    const collections = await Collection.find()
      .sort({ createdAt: -1 })
      .populate(POPULATE)
      .lean();

    return {
      success: true,
      message: "Collections fetched successfully",
      data: collections.map(clean),
    };
  }

  async getCollectionById(id) {
    const collection = await Collection.findById(id).populate(POPULATE).lean();
    if (!collection) throw new ErrorResponse("Collection not found", 404);

    return {
      success: true,
      message: "Collection fetched successfully",
      data: clean(collection),
    };
  }

  async updateCollection(id, data) {
    await this.assertTitleAvailable(data.title, id);
    await this.assertItemsValid(data.items);
    const collection = await Collection.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate(POPULATE);

    if (!collection) throw new ErrorResponse("Collection not found", 404);

    return {
      success: true,
      message: "Collection updated successfully",
      data: clean(collection),
    };
  }

  // ---------- Storefront ----------

  // Live collections in the admin's order, products flattened across categories.
  // Hidden or deleted products are skipped; limit keeps only the first few (homepage preview).
  async getStorefrontCollections({ limit } = {}) {
    const collections = await Collection.find({ isActive: true })
      .sort({ createdAt: 1 })
      .populate(STOREFRONT_POPULATE)
      .lean();

    const data = collections
      .map((c) => {
        const products = storefrontProducts(c);
        return {
          _id: c._id,
          title: c.title,
          placement: c.placement || "after_categories",
          totalProducts: products.length,
          products: limit ? products.slice(0, limit) : products,
        };
      })
      .filter((c) => c.totalProducts > 0);

    return { success: true, message: "Collections fetched successfully", data };
  }

  async getStorefrontCollectionById(id) {
    const collection = await Collection.findOne({ _id: id, isActive: true })
      .populate(STOREFRONT_POPULATE)
      .lean();
    if (!collection) throw new ErrorResponse("Collection not found", 404);

    const products = storefrontProducts(collection);
    return {
      success: true,
      message: "Collection fetched successfully",
      data: {
        _id: collection._id,
        title: collection.title,
        totalProducts: products.length,
        // Categories that still have something to show, for the filter chips
        categories: (collection.items || [])
          .filter((i) => i.category && (i.products || []).some((p) => p))
          .map((i) => ({ _id: i.category._id, name: i.category.name })),
        products,
      },
    };
  }

  async deleteCollection(id) {
    const collection = await Collection.findByIdAndDelete(id);
    if (!collection) throw new ErrorResponse("Collection not found", 404);

    return {
      success: true,
      message: "Collection deleted successfully",
    };
  }
}

module.exports = new CollectionService();
