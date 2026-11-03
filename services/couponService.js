const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const { ErrorResponse } = require("../utils/response");
const {
  toCreateCouponDTO,
  toUpdateCouponDTO,
  toPublicCoupon,
} = require("../dto/coupon.dto");


const mongoose = require("mongoose");

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

// Coupons stay valid for the whole of their expiry day
const isExpired = (coupon, now = new Date()) => {
  if (!coupon.expiresAt) return false;
  const expiryDate = new Date(coupon.expiresAt);
  expiryDate.setHours(23, 59, 59, 999);
  return expiryDate < now;
};

const isExhausted = (coupon) =>
  !!coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;

class CouponService {
  /* ---------------- INTERNAL HELPERS ---------------- */

  async getCouponByCode(code) {
    if (!code) return null;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    }).lean();

    if (!coupon || isExpired(coupon) || isExhausted(coupon)) return null;
    return coupon;
  }

  // Orders that actually went through: paid online, or COD that hasn't failed
  async getCompletedOrderIds(filter) {
    const orders = await Order.find({ ...filter, orderStatus: { $ne: "CANCELLED" } })
      .select("_id")
      .lean();
    if (!orders.length) return [];

    return Payment.distinct("orderId", {
      orderId: { $in: orders.map((o) => o._id) },
      $or: [
        { paymentStatus: "PAID" },
        { paymentMethod: "COD", paymentStatus: { $in: ["CREATED", "PENDING"] } },
      ],
    });
  }

  async countUserUses(userId, code) {
    const ids = await this.getCompletedOrderIds({ userId, couponCode: code });
    return ids.length;
  }

  /* ---------------- APPLY COUPON (PREVIEW ONLY) ---------------- */
  // ⚠️ NO DB WRITE HERE

  async applyCoupon({ code, cartTotal, userId }) {
    const normalized = (code || "").trim().toUpperCase();
    if (!normalized) throw new ErrorResponse("Please enter a coupon code", 400);
    if (!(cartTotal > 0)) throw new ErrorResponse("Your cart is empty", 400);

    const coupon = await Coupon.findOne({ code: normalized }).lean();

    if (!coupon) {
      throw new ErrorResponse(`Coupon "${normalized}" does not exist`, 400);
    }
    if (coupon.isActive === false) {
      throw new ErrorResponse("This coupon is no longer active", 400);
    }
    if (isExpired(coupon)) {
      throw new ErrorResponse(`This coupon expired on ${formatDate(coupon.expiresAt)}`, 400);
    }
    if (isExhausted(coupon)) {
      throw new ErrorResponse("This coupon has been fully redeemed", 400);
    }
    if (cartTotal < (coupon.minOrderValue || 0)) {
      const shortBy = coupon.minOrderValue - cartTotal;
      throw new ErrorResponse(
        `Add ₹${shortBy.toLocaleString("en-IN")} more to use this coupon (minimum order ₹${coupon.minOrderValue.toLocaleString("en-IN")})`,
        400,
      );
    }

    if (userId && coupon.perUserLimit) {
      const usedCount = await this.countUserUses(userId, coupon.code);
      if (usedCount >= coupon.perUserLimit) {
        throw new ErrorResponse(
          coupon.perUserLimit === 1
            ? "You have already used this coupon"
            : `You have already used this coupon ${coupon.perUserLimit} times`,
          400,
        );
      }
    }

    let discount = 0;

    if (coupon.type === "AMOUNT") {
      discount = coupon.value;
    } else {
      discount = Math.round((coupon.value / 100) * cartTotal);
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    }

    discount = Math.min(discount, cartTotal);

    return {
      success: true,
      data: {
        coupon: toPublicCoupon(coupon),
        discount,
        finalAmount: cartTotal - discount,
      },
    };
  }

  /* ---------------- INCREMENT USAGE ---------------- */
  async incrementUsage(coupon) {
    if (!coupon) return;

    // Handle both mongoose document and public DTO format
    const couponId = coupon._id || coupon.id;
    if (!couponId) {
      // Fallback to finding by code
      const couponCode = coupon.code;
      if (!couponCode) return;

      await Coupon.findOneAndUpdate(
        { code: couponCode.toUpperCase() },
        { $inc: { usedCount: 1 } },
        { new: true }
      );
      return;
    }

    await Coupon.findByIdAndUpdate(
      couponId,
      { $inc: { usedCount: 1 } },
      { new: true }
    );
  }

  /* ---------------- LOCK COUPON (AFTER PAYMENT SUCCESS) ---------------- */
  // ✅ CALL THIS ONLY AFTER PAYMENT CONFIRMATION

  async lockCouponUsage({ couponCode, userId, orderId }) {
    if (!couponCode) return;

    // 🔐 Atomic global usage lock
    const coupon = await Coupon.findOneAndUpdate(
      {
        code: couponCode.toUpperCase(),
        $or: [
          { usageLimit: { $exists: false } },
          { $expr: { $lt: ["$usedCount", "$usageLimit"] } },
        ],
      },
      { $inc: { usedCount: 1 } },
      { new: true }
    );

    if (!coupon) {
      throw new Error("Coupon usage limit exceeded");
    }

    // (Optional but recommended)
    // Attach coupon snapshot to order
    await Order.findByIdAndUpdate(orderId, {
      couponCode: coupon.code,
      couponDiscountType: coupon.type,
      couponDiscountValue: coupon.value,
    });
  }

  /* ---------------- ADMIN CRUD ---------------- */

  async assertCodeAvailable(code, exceptId) {
    if (!code) return;
    const existing = await Coupon.findOne({ code: code.toUpperCase() }).select("_id").lean();
    if (existing && String(existing._id) !== String(exceptId)) {
      throw new ErrorResponse(`A coupon with code "${code.toUpperCase()}" already exists`, 409);
    }
  }

  async createCoupon(data) {
    const dto = toCreateCouponDTO(data);
    await this.assertCodeAvailable(dto.code);
    const coupon = await Coupon.create(dto);

    return {
      success: true,
      message: "Coupon created successfully",
      data: toPublicCoupon(coupon),
    };
  }

  async getAllCoupons() {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return {
      success: true,
      message: "Coupons fetched successfully",
      data: coupons.map(toPublicCoupon),
    };
  }

  // Coupons this user can still redeem right now
  async getAllToUserReedemCode(userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const coupons = await Coupon.find({
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gte: startOfToday } }],
    })
      .sort({ createdAt: -1 })
      .lean();

    const usedOrderIds = await this.getCompletedOrderIds({
      userId: userObjectId,
      couponCode: { $in: coupons.map((c) => c.code) },
    });
    const usedOrders = await Order.find({ _id: { $in: usedOrderIds } })
      .select("couponCode")
      .lean();
    const usesByCode = usedOrders.reduce((acc, o) => {
      acc[o.couponCode] = (acc[o.couponCode] || 0) + 1;
      return acc;
    }, {});

    const available = coupons.filter(
      (c) =>
        !isExpired(c) &&
        !isExhausted(c) &&
        (usesByCode[c.code] || 0) < (c.perUserLimit || 1),
    );

    return {
      success: true,
      message: "Coupons fetched successfully",
      data: available.map(toPublicCoupon),
    };
  }

  async getCouponById(id) {
    const coupon = await Coupon.findById(id).lean();
    if (!coupon) throw new ErrorResponse("Coupon not found", 404);

    return {
      success: true,
      message: "Coupon fetched successfully",
      data: toPublicCoupon(coupon),
    };
  }

  async updateCoupon(id, data) {
    const dto = toUpdateCouponDTO(data);
    await this.assertCodeAvailable(dto.code, id);
    const coupon = await Coupon.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });

    if (!coupon) throw new ErrorResponse("Coupon not found", 404);

    return {
      success: true,
      message: "Coupon updated successfully",
      data: toPublicCoupon(coupon),
    };
  }

  async deleteCoupon(id) {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) throw new ErrorResponse("Coupon not found", 404);

    return {
      success: true,
      message: "Coupon deleted successfully",
    };
  }

  /* ---------------- USAGE REPORTS ---------------- */

  async getCouponUsageByCode(code) {
    const normalized = code.toUpperCase();
    const coupon = await Coupon.findOne({ code: normalized }).lean();
    if (!coupon) throw new ErrorResponse("Coupon not found", 404);

    const completedIds = await this.getCompletedOrderIds({ couponCode: normalized });
    const orders = await Order.find({ _id: { $in: completedIds } })
      .populate("userId", "firstName lastName email")
      .select("userId guestContact amount discountAmount orderStatus createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      message: "Coupon usage fetched successfully",
      data: {
        coupon: toPublicCoupon(coupon),
        totalOrders: orders.length,
        totalDiscountGiven: orders.reduce((sum, o) => sum + (o.discountAmount || 0), 0),
        orders,
      },
    };
  }

  async hasUserUsedCoupon(userId, code) {
    const count = await this.countUserUses(userId, code.toUpperCase());
    return {
      success: true,
      message: "Coupon usage checked successfully",
      data: { used: count > 0, count },
    };
  }

  async getUserCouponHistory(userId) {
    const ids = await this.getCompletedOrderIds({
      userId,
      couponCode: { $nin: [null, ""] },
    });
    const orders = await Order.find({ _id: { $in: ids } })
      .select("couponCode discountAmount amount createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      message: "Coupon history fetched successfully",
      data: orders,
    };
  }

  async getUserOrdersWithCoupons(userId) {
    const orders = await Order.find({
      userId,
      couponCode: { $nin: [null, ""] },
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    };
  }
}

module.exports = new CouponService();
