const crypto = require("crypto");
const mongoose = require("mongoose");

const Payment = require("../models/paymentModel");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const getRazorpay = require("../utils/razorpay");

class PaymentService {
  /* ------------------------------------------------
     CREATE PAYMENT (ONLINE / COD)
  ------------------------------------------------ */
  async createPayment({ orderId, userId, paymentMethod = "ONLINE" }) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    if (order.userId && order.userId.toString() !== String(userId)) {
      throw new Error("Unauthorized access to this order");
    }

    if (order.orderStatus !== "PLACED") {
      throw new Error("Order not eligible for payment");
    }

    // ✅ Allow retry only if previous payment FAILED
    const existingPayment = await Payment.findOne({ orderId });
    if (existingPayment && existingPayment.paymentStatus !== "FAILED") {
      throw new Error("Payment already exists for this order");
    }

    /* ---------- COD FLOW ---------- */
    if (paymentMethod === "COD") {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const payment = await Payment.create(
          [
            {
              orderId,
              ...(order.userId ? { userId: order.userId } : {}),
              paymentMethod: "COD",
              provider: "COD",
              paymentStatus: "PENDING",
            },
          ],
          { session },
        );

        await Order.updateOne(
          { _id: orderId },
          { orderStatus: "CONFIRMED" },
          { session },
        );

        // ✅ Clear cart for COD
        if (order.userId) {
          await Cart.updateOne(
            { userId: order.userId },
            { $set: { items: [] } },
            { session },
          );
        }

        await session.commitTransaction();

        return {
          success: true,
          message: "COD order placed successfully",
          data: { payment: payment[0] },
        };
      } catch (err) {
        await session.abortTransaction();
        throw err;
      } finally {
        session.endSession();
      }
    }

    /* ---------- ONLINE (RAZORPAY) ---------- */
    const razorpay = getRazorpay();

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.amount * 100),
      currency: order.currency,
      receipt: `order_${order._id}`,
    });

    const payment = await Payment.create({
      orderId,
      ...(order.userId ? { userId: order.userId } : {}),
      paymentMethod: "ONLINE",
      provider: "RAZORPAY",
      paymentStatus: "CREATED",
      razorpayOrderId: razorpayOrder.id,
    });

    return {
      success: true,
      message: "Payment initiated",
      data: { razorpayOrder, payment },
    };
  }

  /* ------------------------------------------------
     VERIFY PAYMENT (ONLINE ONLY)
  ------------------------------------------------ */
  async verifyPayment({
    orderId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    userId,
  }) {
    const order = await Order.findById(orderId);
    if (!order) {
      return { success: false, message: "Order not found" };
    }

    if (order.userId && order.userId.toString() !== String(userId)) {
      throw new Error("Unauthorized access to this order");
    }

    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return { success: false, message: "Payment not found" };
    }

    // ✅ COD never needs verification
    if (payment.paymentMethod === "COD") {
      return {
        success: true,
        message: "COD payment already confirmed",
        data: { verified: true, payment },
      };
    }

    /* ---------- SIGNATURE CHECK ---------- */
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      await Payment.updateOne(
        { orderId },
        { paymentStatus: "FAILED", failureReason: "Invalid signature" },
      );

      return {
        success: false,
        message: "Invalid payment signature",
      };
    }

    /* ---------- ATOMIC TRANSACTION ---------- */
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1️⃣ Mark payment as PAID
      await Payment.updateOne(
        { orderId },
        {
          paymentStatus: "PAID",
          razorpayPaymentId,
          razorpaySignature,
        },
        { session },
      );

      // 2️⃣ Confirm order
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          orderStatus: "CONFIRMED",
          $push: {
            history: {
              status: "CONFIRMED",
              note: "Payment verified successfully",
            },
          },
        },
        { new: true, session },
      );

      if (!updatedOrder) {
        throw new Error("Order not found");
      }

      const productIds = updatedOrder.items.map((item) => item.productId);


      if (updatedOrder.userId) {
        await Cart.updateOne(
          { userId: updatedOrder.userId },
          { $pull: { items: { productId: { $in: productIds } } } },
          { session },
        );
      }

      await session.commitTransaction();

      return {
        success: true,
        message: "Payment verified successfully",
        data: {
          verified: true,
          orderId,
        },
      };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  /* ------------------------------------------------
     FETCH METHODS (UNCHANGED)
  ------------------------------------------------ */
  async getPaymentByOrderId(orderId) {
    const payment = await Payment.findOne({ orderId }).lean();
    if (!payment) {
      return { success: false, message: "Payment not found", data: null };
    }
    return { success: true, message: "Payment fetched", data: payment };
  }

  async getUserPayments(userId) {
    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, message: "Payments fetched", data: payments };
  }

  async getAllPayments() {
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate("orderId")
      .lean();

    return {
      success: true,
      message: "Payments fetched successfully",
      data: payments,
    };
  }
}

module.exports = new PaymentService();
