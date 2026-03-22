// DTOs for Static Content

function toCreateStaticContentDTO(body = {}) {
  return {
    type: typeof body.type === 'string' ? body.type : undefined,
    title: typeof body.title === 'string' ? body.title.trim() : undefined,
    content: typeof body.content === 'string' ? body.content : undefined,
    isActive: typeof body.isActive === 'boolean' ? body.isActive : undefined,
  };
}

function toUpdateStaticContentDTO(body = {}) {
  const dto = {};
  if (typeof body.content === 'string') dto.content = body.content;
  if (typeof body.isActive === 'boolean') dto.isActive = body.isActive;
  return dto;
}

function toPublicStaticContent(doc) {
  if (!doc) return null;
  const c = doc.toObject ? doc.toObject() : doc;
  return {
    id: c._id?.toString?.() ?? c.id,
    type: c.type,
    title: c.title,
    content: c.content,
    isActive: c.isActive,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

module.exports = { toCreateStaticContentDTO, toUpdateStaticContentDTO, toPublicStaticContent };