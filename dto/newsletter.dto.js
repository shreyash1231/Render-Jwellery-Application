// DTOs for Newsletter

function toCreateNewsletterDTO(body = {}) {
  return {
    email: typeof body.email === 'string' ? body.email.toLowerCase().trim() : undefined,
  };
}

function toUpdateNewsletterDTO(body = {}) {
  const dto = {};
  if (typeof body.email === 'string') dto.email = body.email.toLowerCase().trim();
  return dto;
}

function toPublicNewsletter(doc) {
  if (!doc) return null;
  const n = doc.toObject ? doc.toObject() : doc;
  return {
    id: n._id?.toString?.() ?? n.id,
    email: n.email,
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
  };
}

module.exports = { toCreateNewsletterDTO, toUpdateNewsletterDTO, toPublicNewsletter };