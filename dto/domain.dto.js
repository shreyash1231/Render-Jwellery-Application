// DTOs for Domain

function toCreateDomainDTO(body = {}) {
  return {
    name: typeof body.name === 'string' ? body.name.trim() : undefined,
    description: typeof body.description === 'string' ? body.description.trim() : undefined,
    imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl.trim() : undefined,
    isActive: typeof body.isActive === 'boolean' ? body.isActive : undefined,
  };
}

function toUpdateDomainDTO(body = {}) {
  const dto = {};
  if (typeof body.name === 'string') dto.name = body.name.trim();
  if (typeof body.description === 'string') dto.description = body.description.trim();
  if (typeof body.imageUrl === 'string') dto.imageUrl = body.imageUrl.trim();
  if (typeof body.isActive === 'boolean') dto.isActive = body.isActive;
  return dto;
}

function toPublicDomain(doc) {
  if (!doc) return null;
  const d = doc.toObject ? doc.toObject() : doc;
  return {
    id: d._id?.toString?.() ?? d.id,
    name: d.name,
    description: d.description,
    imageUrl: d.imageUrl,
    isActive: d.isActive,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

module.exports = { toCreateDomainDTO, toUpdateDomainDTO, toPublicDomain };