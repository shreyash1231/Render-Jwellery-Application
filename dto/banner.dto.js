// DTOs for Banner

function toCreateBannerDTO(body = {}) {
  return {
    imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl.trim() : undefined,
  };
}

function toUpdateBannerDTO(body = {}) {
  const dto = {};
  if (typeof body.imageUrl === 'string') dto.imageUrl = body.imageUrl.trim();
  return dto;
}

function toPublicBanner(doc) {
  if (!doc) return null;
  const b = doc.toObject ? doc.toObject() : doc;
  return {
    id: b._id?.toString?.() ?? b.id,
    imageUrl: b.imageUrl,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  };
}

module.exports = { toCreateBannerDTO, toUpdateBannerDTO, toPublicBanner };
