const CustomOrder = require("../models/customOrderModel");

/* ---------- CREATE CUSTOM ORDER ---------- */
async function createCustomOrder(payload) {
  const customOrder = await CustomOrder.create(payload);
  return customOrder;
}

/* ---------- GET CUSTOM ORDER BY ID ---------- */
async function getCustomOrderById(orderId) {
  const order = await CustomOrder.findById(orderId)
    .populate("userId", "firstName lastName email")
    .lean();

  return order;
}

/* ---------- GET ALL CUSTOM ORDERS (ADMIN) ---------- */
async function getAllCustomOrders({ page = 1, limit = 10, status, userId, type }) {
  const filter = {};

  if (status) filter.status = status;
  if (userId) filter.userId = userId;
  if (type) filter.type = type;

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    CustomOrder.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "firstName lastName email")
      .lean(),

    CustomOrder.countDocuments(filter),
  ]);

  return {
    data: orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/* ---------- GET USER'S CUSTOM ORDERS ---------- */
async function getMyCustomOrders(userId) {
  return await CustomOrder.find({ userId })
    .sort({ createdAt: -1 })
    .lean();
}

/* ---------- UPDATE CUSTOM ORDER STATUS (ADMIN) ---------- */
async function updateCustomOrderStatus(orderId, status) {
  const order = await CustomOrder.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  ).lean();

  return order;
}

/* ---------- DELETE CUSTOM ORDER (ADMIN) ---------- */
async function deleteCustomOrder(orderId) {
  return await CustomOrder.findByIdAndDelete(orderId);
}

/* ---------- DASHBOARD STATS (ADMIN) ---------- */
async function getCustomOrderDashboardStats() {
  const totalOrders = await CustomOrder.countDocuments();

  const statusStats = await CustomOrder.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const recentOrders = await CustomOrder.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("userId", "firstName lastName email")
    .lean();

  return {
    totalOrders,
    statusStats,
    recentOrders,
  };
}

module.exports = {
  createCustomOrder,
  getCustomOrderById,
  getAllCustomOrders,
  getMyCustomOrders,
  updateCustomOrderStatus,
  deleteCustomOrder,
  getCustomOrderDashboardStats,
};
