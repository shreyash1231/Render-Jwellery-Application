const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Reel = require("../models/reelModel");
const Category = require("../models/categoriesModal");
const CustomOrder = require("../models/customOrderModel"); // 👈 ADD THIS

async function getDashboardStats() {
  const userCount = await User.countDocuments();
  const orderCount = await Order.countDocuments();
  const customOrderCount = await CustomOrder.countDocuments(); // 👈 ADD THIS
  const reelCount = await Reel.countDocuments();
  const categoryCount = await Category.countDocuments();

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("userId", "firstName lastName email")
    .populate("items.productId", "title price");

  return {
    userCount,
    orderCount,
    customOrderCount, // 👈 RETURN IT
    reelCount,
    categoryCount,
    recentOrders,
  };
}

module.exports = { getDashboardStats };
