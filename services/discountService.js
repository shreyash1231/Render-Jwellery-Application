const Discount = require("../models/discountModel");
const Category = require("../models/categoriesModal");
const Product = require("../models/productsModel");
const { ErrorResponse } = require("../utils/response");

const POPULATE = [
  { path: "category", select: "name imageUrl" },
  { path: "products.product", select: "name imageUrl sellingPrice mrp categoryId isActive" },
];

const idStr = (x) => String(x?._id || x);

// Offer price for one product under one discount. Never below ₹1 so an order is never free.
const offerPrice = (sellingPrice, discount) => {
  const base = Number(sellingPrice) || 0;
  const off = discount.type === "percentage" ? (base * discount.value) / 100 : discount.value;
  return Math.max(Math.round(base - off), Math.min(1, base));
};

// Does this discount cover this product right now (dates and switches already checked)?
const covers = (discount, product) => {
  if (idStr(discount.category) !== idStr(product.categoryId)) return false;
  if (discount.scope === "category") return true;
  return (discount.products || []).some(
    (p) => p.isActive !== false && idStr(p.product) === idStr(product._id)
  );
};

// Drop products that were deleted after the discount was saved
const clean = (discount) => {
  if (!discount) return discount;
  const d = discount.toObject ? discount.toObject() : discount;
  d.products = (d.products || []).filter((p) => p.product);
  return d;
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

    const category = await Category.exists({ _id: d.category });
    if (!category) throw new ErrorResponse("The selected category no longer exists", 400);

    if (d.scope !== "products") return;
    if (!d.products?.length) throw new ErrorResponse("Select at least one product", 400);

    const ids = d.products.map((p) => idStr(p.product));
    const products = await Product.find({ _id: { $in: ids } }).select("name categoryId").lean();
    if (products.length !== ids.length) {
      throw new ErrorResponse("One of the selected products no longer exists", 400);
    }
    const stray = products.find((p) => idStr(p.categoryId) !== idStr(d.category));
    if (stray) throw new ErrorResponse(`"${stray.name}" is not in the selected category`, 400);
  }

  async createDiscount(data) {
    if (data.scope !== "products") data.products = [];
    await this.assertValid(data);
    const created = await Discount.create(data);
    const discount = await Discount.findById(created._id).populate(POPULATE).lean();

    return { success: true, message: "Discount created successfully", data: clean(discount) };
  }

  async getAllDiscounts() {
    const discounts = await Discount.find().sort({ createdAt: -1 }).populate(POPULATE).lean();
    return { success: true, message: "Discounts fetched successfully", data: discounts.map(clean) };
  }

  async updateDiscount(id, data) {
    const discount = await Discount.findById(id);
    if (!discount) throw new ErrorResponse("Discount not found", 404);

    discount.set(data);
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
    const now = new Date();
    const filter = { isActive: true, startDate: { $lte: now }, endDate: { $gte: now } };
    if (categoryIds) filter.category = { $in: categoryIds };
    return Discount.find(filter).select("title category scope products type value endDate").lean();
  }

  // Puts live offers on plain product objects, in place, and returns them.
  // sellingPrice becomes the offer price (the website, cart and checkout all read it);
  // the price before the offer is kept in originalSellingPrice. When several offers
  // cover a product the customer gets the lowest price.
  async applyOffers(products) {
    const list = (products || []).filter((p) => p && typeof p === "object" && p.categoryId);
    if (!list.length) return products;

    const categoryIds = [...new Set(list.map((p) => idStr(p.categoryId)))];
    const discounts = await this.getLiveDiscounts(categoryIds);
    if (!discounts.length) return products;

    for (const p of list) {
      let best = null;
      let bestPrice = p.sellingPrice;
      for (const d of discounts) {
        if (!covers(d, p)) continue;
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
