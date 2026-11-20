const Discount = require("../models/discountModel");
const Category = require("../models/categoriesModal");
const Product = require("../models/productsModel");
const ProductCategory = require("../models/productCategoryModel");
const { ErrorResponse } = require("../utils/response");

const POPULATE = [
  { path: "categories", select: "name imageUrl" },
  { path: "products.product", select: "name imageUrl sellingPrice mrp categoryId isActive" },
];

const idStr = (x) => String(x?._id || x);

// Offer price for one product under one discount. Never below ₹1 so an order is never free.
const offerPrice = (sellingPrice, discount) => {
  const base = Number(sellingPrice) || 0;
  const off = discount.type === "percentage" ? (base * discount.value) / 100 : discount.value;
  return Math.max(Math.round(base - off), Math.min(1, base));
};

const categoryIdsOf = (discount) => (discount.categories || []).map(idStr);

// Category ids each product is listed in: its main category plus active Multi Category links.
// Returns Map(productId -> Set(categoryId)).
const categoriesOfProducts = async (products) => {
  const map = new Map();
  products.forEach((p) => {
    const set = new Set();
    if (p.categoryId) set.add(idStr(p.categoryId));
    map.set(idStr(p._id), set);
  });
  if (!map.size) return map;
  const links = await ProductCategory.find({ product: { $in: [...map.keys()] }, isActive: true })
    .select("product category")
    .lean();
  links.forEach((l) => map.get(idStr(l.product))?.add(idStr(l.category)));
  return map;
};

// Does this discount cover this product right now (dates and switches already checked)?
const covers = (discount, productId, productCats) => {
  if (!categoryIdsOf(discount).some((c) => productCats.has(c))) return false;
  if (discount.scope === "category") return true;
  return (discount.products || []).some(
    (p) => p.isActive !== false && idStr(p.product) === productId
  );
};

// Drop products and categories that were deleted after the discount was saved
const clean = (discount) => {
  if (!discount) return discount;
  const d = discount.toObject ? discount.toObject() : discount;
  d.products = (d.products || []).filter((p) => p.product);
  d.categories = (d.categories || []).filter(Boolean);
  delete d.category;
  return d;
};

// Offers saved with a single `category` get it moved into `categories`, once per server start
let migrated = null;
const migrateOldDiscounts = () => {
  if (!migrated) {
    migrated = Discount.updateMany(
      { category: { $ne: null }, $or: [{ categories: { $exists: false } }, { categories: { $size: 0 } }] },
      [{ $set: { categories: ["$category"] } }, { $unset: "category" }]
    ).catch((err) => {
      migrated = null;
      throw err;
    });
  }
  return migrated;
};

class DiscountService {
  // ---------- Admin ----------

  async assertValid(d) {
    if (d.type === "percentage" && d.value >= 100) {
      throw new ErrorResponse("Percentage must be less than 100", 400);
    }
    if (new Date(d.endDate) < new Date(d.startDate)) {
      throw new ErrorResponse("End date must be on or after the start date", 400);
    }

    const catIds = categoryIdsOf(d);
    if (!catIds.length) throw new ErrorResponse("Choose at least one category", 400);
    const found = await Category.countDocuments({ _id: { $in: catIds } });
    if (found !== catIds.length) {
      throw new ErrorResponse("One of the selected categories no longer exists", 400);
    }

    if (d.scope !== "products") return;
    if (!d.products?.length) throw new ErrorResponse("Select at least one product", 400);

    const ids = d.products.map((p) => idStr(p.product));
    const products = await Product.find({ _id: { $in: ids } }).select("name categoryId").lean();
    if (products.length !== ids.length) {
      throw new ErrorResponse("One of the selected products no longer exists", 400);
    }
    const cats = await categoriesOfProducts(products);
    const stray = products.find((p) => !catIds.some((c) => cats.get(idStr(p._id)).has(c)));
    if (stray) throw new ErrorResponse(`"${stray.name}" is not in the selected categories`, 400);
  }

  async createDiscount(data) {
    if (data.scope !== "products") data.products = [];
    await this.assertValid(data);
    const created = await Discount.create(data);
    const discount = await Discount.findById(created._id).populate(POPULATE).lean();

    return { success: true, message: "Discount created successfully", data: clean(discount) };
  }

  async getAllDiscounts() {
    await migrateOldDiscounts();
    const discounts = await Discount.find().sort({ createdAt: -1 }).populate(POPULATE).lean();
    return { success: true, message: "Discounts fetched successfully", data: discounts.map(clean) };
  }

  async updateDiscount(id, data) {
    await migrateOldDiscounts();
    const discount = await Discount.findById(id);
    if (!discount) throw new ErrorResponse("Discount not found", 404);

    discount.set(data);
    discount.category = undefined;
    if (discount.scope !== "products") discount.products = [];
    await this.assertValid(discount.toObject());
    await discount.save();
    await discount.populate(POPULATE);

    return { success: true, message: "Discount updated successfully", data: clean(discount) };
  }

  async deleteDiscount(id) {
    const discount = await Discount.findByIdAndDelete(id);
    if (!discount) throw new ErrorResponse("Discount not found", 404);
    return { success: true, message: "Discount deleted successfully" };
  }

  // ---------- Storefront pricing ----------

  async getLiveDiscounts(categoryIds) {
    await migrateOldDiscounts();
    const now = new Date();
    const filter = { isActive: true, startDate: { $lte: now }, endDate: { $gte: now } };
    if (categoryIds) filter.categories = { $in: categoryIds };
    return Discount.find(filter).select("title categories scope products type value endDate").lean();
  }

  // Puts live offers on plain product objects, in place, and returns them.
  // sellingPrice becomes the offer price (the website, cart and checkout all read it);
  // the price before the offer is kept in originalSellingPrice. A product listed in several
  // categories can be covered by several offers; the customer gets the lowest price.
  async applyOffers(products) {
    const list = (products || []).filter((p) => p && typeof p === "object" && p._id && p.categoryId);
    if (!list.length) return products;

    const cats = await categoriesOfProducts(list);
    const categoryIds = [...new Set([...cats.values()].flatMap((s) => [...s]))];
    const discounts = await this.getLiveDiscounts(categoryIds);
    if (!discounts.length) return products;

    for (const p of list) {
      const pid = idStr(p._id);
      let best = null;
      let bestPrice = p.sellingPrice;
      for (const d of discounts) {
        if (!covers(d, pid, cats.get(pid))) continue;
        const price = offerPrice(p.sellingPrice, d);
        if (price < bestPrice) {
          best = d;
          bestPrice = price;
        }
      }
      if (!best) continue;

      p.originalSellingPrice = p.sellingPrice;
      p.sellingPrice = bestPrice;
      if (p.mrp) p.discountPercent = Math.round(((p.mrp - bestPrice) / p.mrp) * 100);
      p.offer = {
        _id: best._id,
        title: best.title,
        type: best.type,
        value: best.value,
        endDate: best.endDate,
      };
    }
    return products;
  }
}

module.exports = new DiscountService();
module.exports.offerPrice = offerPrice;
