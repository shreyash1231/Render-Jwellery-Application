const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const Product = require("../models/productsModel");
const CouponService = require("./couponService");
const Address = require("../models/addressModel");

class OrderService {
  async createOrder(
    userId,
    items,
    addressId,
    shippingAddress,
    guestContact = null,
    couponCode = null,
    currency = "INR",
  ) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    let address = null;

    if (userId && addressId) {
      address = await Address.findOne({ _id: addressId, userId }).lean();
      if (!address) {
        throw new Error("Invalid address");
      }
    } else if (shippingAddress) {
      address = {
        country: shippingAddress.country,
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName || "",
        contactNumber: shippingAddress.contactNumber,
        address: shippingAddress.address,
        apartment: shippingAddress.apartment || "",
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
      };
    } else {
      throw new Error("Shipping address is required");
    }

    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    let amount = 0;
    const orderItems = [];

    // 🔹 STEP 1: Calculate amount (NO COUPON HERE)
    for (const item of items) {
      const product = productMap.get(item.productId.toString());

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      const price = product.sellingPrice; // ✅ FIXED
      amount += price * item.quantity;

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price, // selling price at order time
      });
    }

    // 🔹 STEP 2: Apply coupon ONLY if sent
    let discountAmount = 0;
    let appliedCoupon = null;
    if (couponCode && typeof couponCode === "string" && couponCode.trim()) {
      const couponResult = await CouponService.applyCoupon({
        code: couponCode.trim(),
        cartTotal: amount,
        userId: userId,
      });

      discountAmount = couponResult.data?.discount || 0;
      appliedCoupon = couponResult.data?.coupon || null;
      amount = Math.max(amount - discountAmount, 0);
    }

    // 🔹 STEP 3: Transaction (stock + order)
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (const item of orderItems) {
        const updated = await Product.findOneAndUpdate(
          {
            _id: item.productId,
            quantity: { $gte: item.quantity },
          },
          {
            $inc: { quantity: -item.quantity },
          },
          { new: true, session },
        );

        if (!updated) {
          throw new Error("Stock update failed");
        }
      }

      const order = await Order.create(
        [
          {
            ...(userId ? { userId } : {}),
            ...(addressId ? { addressId } : {}),
            shippingAddress: address,
            guestContact: guestContact || {},
            checkoutMode: userId ? "USER" : "GUEST",
            items: orderItems,
            amount,
            discountAmount,
            couponCode: appliedCoupon ? appliedCoupon.code : null,
            currency,
            orderStatus: "PLACED",
            history: [{ status: "PLACED", note: "Order created" }],
          },
        ],
        { session },
      );

      // 🔹 STEP 4: Increment coupon usage ONLY if applied
      if (appliedCoupon) {
        await CouponService.incrementUsage(appliedCoupon);
      }

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        message: "Order created successfully",
        data: order[0],
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  async getOrderById(orderId) {
    const order = await Order.findById(orderId)
      .populate("items.productId")
      .populate("addressId");

    if (!order) {
      throw new Error("Order not found");
    }

    return {
      success: true,
      data: order,
    };
  }

  /**
   * GET USER ORDERS
   */
  async getUserOrders(userId) {
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("items.productId").lean();

    return {
      success: true,
      data: orders,
    };
  }

  /**
   * GET ALL ORDERS (ADMIN)
   */
  async getAllOrders() {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("items.productId")
      .populate("userId", "name email")
      .populate("addressId").lean();

    return {
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    };
  }

  /**
   * UPDATE ORDER STATUS (ADMIN / SYSTEM)
   */
  async updateOrderStatus(orderId, status, note = "") {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.orderStatus = status;
    order.history.push({ status, note });

    await order.save();

    return {
      success: true,
      message: "Order status updated",
      data: order,
    };
  }
}

module.exports = new OrderService();
