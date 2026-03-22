const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const {
  toCreateCouponDTO,
  toUpdateCouponDTO,
  toPublicCoupon,
} = require("../dto/coupon.dto");

class CouponService {
  /* ---------------- INTERNAL HELPERS ---------------- */

  async getCouponByCode(code) {
    if (!code) return null;

    const now = new Date();

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    }).lean();

    if (!coupon) return null;

    // Check expiration date - coupon is valid if expiresAt is in the future
    // Allow usage on the expiration date itself (expiresAt >= now)
    if (coupon.expiresAt) {
      const expiryDate = new Date(coupon.expiresAt);
      // Set expiry date to end of day to allow usage throughout the expiration day
      expiryDate.setHours(23, 59, 59, 999);
      if (expiryDate < now) {
        return null;
      }
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return null;

    return coupon;
  }

  /* ---------------- APPLY COUPON (PREVIEW ONLY) ---------------- */
  // ⚠️ NO DB WRITE HERE

  async applyCoupon({ code, cartTotal, userId }) {
    const coupon = await this.getCouponByCode(code);
    if (!coupon) {
      throw new Error("Invalid or expired coupon");
    }

    if (cartTotal < coupon.minOrderValue) {
      throw new Error(`Minimum order value ₹${coupon.minOrderValue} required`);
    }

    // Per-user limit check (successful orders only)
    if (userId && coupon.perUserLimit) {
      const usedCount = await Order.countDocuments({
        userId,
        couponCode: coupon.code,
        paymentStatus: "SUCCESS",
      });

      if (usedCount >= coupon.perUserLimit) {
        throw new Error("Coupon usage limit exceeded for this user");
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

  async createCoupon(data) {
    const dto = toCreateCouponDTO(data);
    const coupon = await Coupon.create(dto);

    return {
      success: true,
      data: toPublicCoupon(coupon),
    };
  }

  async getAllCoupons() {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return {
      success: true,
      data: coupons.map(toPublicCoupon),
    };
  }

  async getCouponById(id) {
    const coupon = await Coupon.findById(id).lean();
    if (!coupon) throw new Error("Coupon not found");

    return {
      success: true,
      data: toPublicCoupon(coupon),
    };
  }

  async updateCoupon(id, data) {
    const dto = toUpdateCouponDTO(data);
    const coupon = await Coupon.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });

    if (!coupon) throw new Error("Coupon not found");

    return {
      success: true,
      data: toPublicCoupon(coupon),
    };
  }

  async deleteCoupon(id) {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) throw new Error("Coupon not found");

    return {
      success: true,
      message: "Coupon deleted successfully",
    };
  }
}

module.exports = new CouponService();
