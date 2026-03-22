// DTOs for Coupon

function toCreateCouponDTO(body = {}) {
  return {
    code: typeof body.code === "string" ? body.code.trim().toUpperCase() : undefined,
    type: body.type || "AMOUNT",
    value: typeof body.value === "number" ? body.value : undefined,
    minOrderValue: typeof body.minOrderValue === "number" ? body.minOrderValue : 0,
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    usageLimit: typeof body.usageLimit === "number" ? body.usageLimit : undefined,
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
  if (typeof body.usageLimit === "number") dto.usageLimit = body.usageLimit;
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
    minOrderValue: c.minOrderValue,
    expiresAt: c.expiresAt,
    usageLimit: c.usageLimit,
    usedCount: c.usedCount,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

module.exports = {
  toCreateCouponDTO,
  toUpdateCouponDTO,
  toPublicCoupon,
};
