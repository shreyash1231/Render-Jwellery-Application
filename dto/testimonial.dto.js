// DTOs for Testimonial

function toCreateTestimonialDTO(body = {}) {
  return {
    name: typeof body.name === 'string' ? body.name.trim() : undefined,
    country: typeof body.country === 'string' ? body.country.trim() : undefined,
    message: typeof body.message === 'string' ? body.message.trim() : undefined,
    imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl.trim() : undefined,
  };
}

function toUpdateTestimonialDTO(body = {}) {
  const dto = {};
  if (typeof body.name === 'string') dto.name = body.name.trim();
  if (typeof body.country === 'string') dto.country = body.country.trim();
  if (typeof body.message === 'string') dto.message = body.message.trim();
  if (typeof body.imageUrl === 'string') dto.imageUrl = body.imageUrl.trim();
  return dto;
}

function toPublicTestimonial(doc) {
  if (!doc) return null;
  const t = doc.toObject ? doc.toObject() : doc;
  return {
    id: t._id?.toString?.() ?? t.id,
    name: t.name,
    country: t.country,
    message: t.message,
    imageUrl: t.imageUrl,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

module.exports = { toCreateTestimonialDTO, toUpdateTestimonialDTO, toPublicTestimonial };