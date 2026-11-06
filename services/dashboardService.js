const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const Product = require("../models/productsModel");
const Reel = require("../models/reelModel");
const Category = require("../models/categoriesModal");
const CustomOrder = require("../models/customOrderModel");
const Coupon = require("../models/couponModel");
const Collection = require("../models/collectionModel");
const NewsLetter = require("../models/newsLetter");
const GetInTouch = require("../models/getInTouchModel");

const TZ = "Asia/Kolkata";
const IST_OFFSET = 330 * 60 * 1000;
const DAY = 24 * 60 * 60 * 1000;
const LOW_STOCK = 5;
const RANGES = [7, 30, 90, 365];

// Midnight in India, n days before today (0 = today)
const istDayStart = (daysAgo = 0) => {
  const now = Date.now() + IST_OFFSET;
  return new Date(Math.floor(now / DAY) * DAY - daysAgo * DAY - IST_OFFSET);
};

const dayKey = (d) => new Date(d.getTime() + IST_OFFSET).toISOString().slice(0, 10);
const monthKey = (d) => dayKey(d).slice(0, 7);

const pctChange = (cur, prev) => (prev ? Math.round(((cur - prev) / prev) * 1000) / 10 : null);

// An order is real once it is paid online, or placed as COD that hasn't failed.
// Online checkouts that were never paid also create an order, so they are left out.
async function realOrderIds(match = {}) {
  const ids = await Payment.distinct("orderId", {
    $or: [
      { paymentStatus: "PAID" },
      { paymentMethod: "COD", paymentStatus: { $in: ["CREATED", "PENDING"] } },
    ],
  });
  if (!Object.keys(match).length) return ids;
  return Order.distinct("_id", { _id: { $in: ids }, ...match });
}

async function summarise(ids, from, to) {
  const created = {};
  if (from) created.$gte = from;
  if (to) created.$lt = to;
  const match = { _id: { $in: ids }, orderStatus: { $ne: "CANCELLED" } };
  if (from || to) match.createdAt = created;

  const [row] = await Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$amount" },
        orders: { $sum: 1 },
        discount: { $sum: { $ifNull: ["$discountAmount", 0] } },
      },
    },
  ]);
  return row || { revenue: 0, orders: 0, discount: 0 };
}

async function getDashboardStats({ range } = {}) {
  const days = RANGES.includes(Number(range)) ? Number(range) : null; // null = all time
  const from = days ? istDayStart(days - 1) : null;
  const prevFrom = days ? istDayStart(2 * days - 1) : null;
  const inRange = from ? { createdAt: { $gte: from } } : {};

  const ids = await realOrderIds();
  const live = { _id: { $in: ids }, orderStatus: { $ne: "CANCELLED" }, ...inRange };

  const [
    userCount,
    orderCount,
    customOrderCount,
    reelCount,
    categoryCount,
    productCount,
    activeProductCount,
    collectionCount,
    activeCouponCount,
    subscriberCount,
    queryCount,
    pendingCustomOrders,
    current,
    previous,
    newUsers,
    prevNewUsers,
    unpaidCheckouts,
    statusRows,
    paymentRows,
    trendRows,
    topProducts,
    topCategories,
    outOfStock,
    lowStockCount,
    lowStockItems,
    recentOrders,
  ] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    CustomOrder.countDocuments(),
    Reel.countDocuments(),
    Category.countDocuments(),
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Collection.countDocuments(),
    Coupon.countDocuments({
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gte: istDayStart(0) } }],
    }),
    NewsLetter.countDocuments(),
    GetInTouch.countDocuments(),
    CustomOrder.countDocuments({ status: "PENDING" }),
    summarise(ids, from),
    days ? summarise(ids, prevFrom, from) : null,
    User.countDocuments(inRange),
    days ? User.countDocuments({ createdAt: { $gte: prevFrom, $lt: from } }) : null,
    Order.aggregate([
      { $match: { _id: { $nin: ids }, orderStatus: { $ne: "CANCELLED" }, ...inRange } },
      { $group: { _id: null, count: { $sum: 1 }, amount: { $sum: "$amount" } } },
    ]),

    Order.aggregate([
      { $match: { _id: { $in: ids }, ...inRange } },
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]),

    Payment.aggregate([
      { $match: { orderId: { $in: ids } } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: "$orderId", method: { $first: "$paymentMethod" } } },
      { $lookup: { from: "orders", localField: "_id", foreignField: "_id", as: "order" } },
      { $unwind: "$order" },
      { $match: { "order.orderStatus": { $ne: "CANCELLED" }, ...(from ? { "order.createdAt": { $gte: from } } : {}) } },
      { $group: { _id: "$method", count: { $sum: 1 }, amount: { $sum: "$order.amount" } } },
    ]),

    // Every checkout that wasn't cancelled, with the paid ones counted separately
    Order.aggregate([
      { $match: { orderStatus: { $ne: "CANCELLED" }, ...inRange } },
      { $addFields: { paid: { $in: ["$_id", ids] } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: days && days <= 90 ? "%Y-%m-%d" : "%Y-%m",
              date: "$createdAt",
              timezone: TZ,
            },
          },
          revenue: { $sum: { $cond: ["$paid", "$amount", 0] } },
          orders: { $sum: { $cond: ["$paid", 1, 0] } },
          placed: { $sum: 1 },
        },
      },
    ]),

    Order.aggregate([
      { $match: live },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          quantity: 1,
          revenue: 1,
          name: { $ifNull: ["$product.name", "Deleted product"] },
          image: { $arrayElemAt: ["$product.imageUrl", 0] },
        },
      },
    ]),

    Order.aggregate([
      { $match: live },
      { $unwind: "$items" },
      { $lookup: { from: "products", localField: "items.productId", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.categoryId",
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" } },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      { $project: { quantity: 1, revenue: 1, name: { $ifNull: ["$category.name", "Deleted category"] } } },
    ]),

    Product.countDocuments({ isActive: true, quantity: { $lte: 0 } }),
    Product.countDocuments({ isActive: true, quantity: { $gt: 0, $lte: LOW_STOCK } }),
    Product.find({ isActive: true, quantity: { $lte: LOW_STOCK } })
      .sort({ quantity: 1, name: 1 })
      .limit(6)
      .select("name quantity imageUrl sellingPrice")
      .lean(),

    Order.find({ _id: { $in: ids } })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("userId", "firstName lastName email")
      .select("userId guestContact shippingAddress amount orderStatus items createdAt")
      .lean(),
  ]);

  // Every bucket in the range, including the days/months with no sales
  const byKey = Object.fromEntries(trendRows.map((r) => [r._id, r]));
  const keys = [];
  if (days && days <= 90) {
    for (let i = days - 1; i >= 0; i--) keys.push(dayKey(istDayStart(i)));
  } else {
    const first = days ? from : (await Order.findOne().sort({ createdAt: 1 }).lean())?.createdAt;
    if (first) {
      const [y0, m0] = monthKey(first).split("-").map(Number);
      const [y1, m1] = monthKey(new Date()).split("-").map(Number);
      for (let y = y0, m = m0; y < y1 || (y === y1 && m <= m1); m === 12 ? (y++, (m = 1)) : m++) {
        keys.push(`${y}-${String(m).padStart(2, "0")}`);
      }
    }
  }
  const trend = keys.map((k) => ({
    key: k,
    revenue: byKey[k]?.revenue || 0,
    orders: byKey[k]?.orders || 0,
    placed: byKey[k]?.placed || 0,
  }));

  const avg = (s) => (s && s.orders ? Math.round(s.revenue / s.orders) : 0);
  const STATUSES = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
  const statusCount = Object.fromEntries(statusRows.map((r) => [r._id, r.count]));

  return {
    // Kept for older admin builds
    userCount,
    orderCount,
    customOrderCount,
    reelCount,
    categoryCount,

    range: days || "all",
    bucket: days && days <= 90 ? "day" : "month",
    kpis: {
      revenue: current.revenue,
      revenueChange: previous ? pctChange(current.revenue, previous.revenue) : null,
      orders: current.orders,
      ordersChange: previous ? pctChange(current.orders, previous.orders) : null,
      avgOrderValue: avg(current),
      avgOrderValueChange: previous ? pctChange(avg(current), avg(previous)) : null,
      newUsers,
      newUsersChange: previous ? pctChange(newUsers, prevNewUsers) : null,
      discountGiven: current.discount,
      unpaidCheckouts: unpaidCheckouts[0]?.count || 0,
      unpaidValue: unpaidCheckouts[0]?.amount || 0,
    },
    trend,
    ordersByStatus: STATUSES.map((status) => ({ status, count: statusCount[status] || 0 })),
    paymentMethods: ["ONLINE", "COD"].map((m) => {
      const row = paymentRows.find((r) => r._id === m);
      return { method: m, count: row?.count || 0, amount: row?.amount || 0 };
    }),
    topProducts,
    topCategories,
    inventory: {
      productCount,
      activeProductCount,
      outOfStock,
      lowStock: lowStockCount,
      lowStockThreshold: LOW_STOCK,
      items: lowStockItems,
    },
    totals: {
      collectionCount,
      activeCouponCount,
      subscriberCount,
      queryCount,
      pendingCustomOrders,
    },
    recentOrders: recentOrders.map((o) => ({
      _id: o._id,
      customer:
        [o.userId?.firstName, o.userId?.lastName].filter(Boolean).join(" ") ||
        [o.shippingAddress?.firstName, o.shippingAddress?.lastName].filter(Boolean).join(" ") ||
        o.guestContact?.email ||
        "Guest",
      amount: o.amount,
      status: o.orderStatus,
      items: (o.items || []).reduce((n, i) => n + (i.quantity || 0), 0),
      createdAt: o.createdAt,
    })),
  };
}

module.exports = { getDashboardStats };
