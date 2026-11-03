// DTOs for Coupon

const numOrNull = (v) => (typeof v === "number" ? v : null);

function toCreateCouponDTO(body = {}) {
  const type = body.type || "AMOUNT";
  return {
    code: typeof body.code === "string" ? body.code.trim().toUpperCase() : undefined,
    type,
    value: typeof body.value === "number" ? body.value : undefined,
    // A cap only makes sense for percentage coupons
    maxDiscount:
      type === "PERCENT" && typeof body.maxDiscount === "number" ? body.maxDiscount : undefined,
    minOrderValue: typeof body.minOrderValue === "number" ? body.minOrderValue : 0,
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    usageLimit: typeof body.usageLimit === "number" ? body.usageLimit : undefined,
    perUserLimit: typeof body.perUserLimit === "number" ? body.perUserLimit : 1,
    isActive: typeof body.isActive === "boolean" ? body.isActive : true,
  };
}

function toUpdateCouponDTO(body = {}) {
  const dto = {};
  if (typeof body.code === "string") dto.code = body.code.trim().toUpperCase();
  if (body.type) dto.type = body.type;
  if (typeof body.value === "number") dto.value = body.value;
  if (typeof body.minOrderValue === "number") dto.minOrderValue = body.minOrderValue;
  if (body.expiresAt !== undefined) {
    dto.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
  }
  // null clears the limit / cap
  if (body.usageLimit !== undefined) dto.usageLimit = numOrNull(body.usageLimit);
  if (body.maxDiscount !== undefined) dto.maxDiscount = numOrNull(body.maxDiscount);
  if (dto.type === "AMOUNT") dto.maxDiscount = null;
  if (typeof body.perUserLimit === "number") dto.perUserLimit = body.perUserLimit;
  if (typeof body.isActive === "boolean") dto.isActive = body.isActive;
  return dto;
}

function toPublicCoupon(doc) {
  if (!doc) return null;
  const c = doc.toObject ? doc.toObject() : doc;
  return {
    id: c._id?.toString?.() ?? c.id,
    code: c.code,
    type: c.type,
    value: c.value,
    maxDiscount: c.maxDiscount,
    minOrderValue: c.minOrderValue,
    expiresAt: c.expiresAt,
    usageLimit: c.usageLimit,
    usedCount: c.usedCount,
    perUserLimit: c.perUserLimit,
    isActive: c.isActive !== false,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

module.exports = {
  toCreateCouponDTO,
  toUpdateCouponDTO,
  toPublicCoupon,
};
