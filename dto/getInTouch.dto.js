// DTOs for GetInTouch

function toCreateGetInTouchDTO(body = {}) {
  const address = typeof body.address === 'object' && body.address !== null ? {
    street: typeof body.address.street === 'string' ? body.address.street.trim() : undefined,
    city: typeof body.address.city === 'string' ? body.address.city.trim() : undefined,
    state: typeof body.address.state === 'string' ? body.address.state.trim() : undefined,
    country: typeof body.address.country === 'string' ? body.address.country.trim() : undefined,
    zipCode: typeof body.address.zipCode === 'string' ? body.address.zipCode.trim() : undefined,
  } : undefined;

  const socialLinks = typeof body.socialLinks === 'object' && body.socialLinks !== null ? {
    facebook: typeof body.socialLinks.facebook === 'string' ? body.socialLinks.facebook.trim() : undefined,
    twitter: typeof body.socialLinks.twitter === 'string' ? body.socialLinks.twitter.trim() : undefined,
    instagram: typeof body.socialLinks.instagram === 'string' ? body.socialLinks.instagram.trim() : undefined,
    linkedin: typeof body.socialLinks.linkedin === 'string' ? body.socialLinks.linkedin.trim() : undefined,
  } : undefined;

  return {
    address,
    phone: typeof body.phone === 'string' ? body.phone.trim() : undefined,
    email: typeof body.email === 'string' ? body.email.toLowerCase().trim() : undefined,
    socialLinks,
  };
}

function toUpdateGetInTouchDTO(body = {}) {
  const dto = {};
  if (typeof body.address === 'object' && body.address !== null) {
    dto.address = {};
    if (typeof body.address.street === 'string') dto.address.street = body.address.street.trim();
    if (typeof body.address.city === 'string') dto.address.city = body.address.city.trim();
    if (typeof body.address.state === 'string') dto.address.state = body.address.state.trim();
    if (typeof body.address.country === 'string') dto.address.country = body.address.country.trim();
    if (typeof body.address.zipCode === 'string') dto.address.zipCode = body.address.zipCode.trim();
  }
  if (typeof body.phone === 'string') dto.phone = body.phone.trim();
  if (typeof body.email === 'string') dto.email = body.email.toLowerCase().trim();
  if (typeof body.socialLinks === 'object' && body.socialLinks !== null) {
    dto.socialLinks = {};
    if (typeof body.socialLinks.facebook === 'string') dto.socialLinks.facebook = body.socialLinks.facebook.trim();
    if (typeof body.socialLinks.twitter === 'string') dto.socialLinks.twitter = body.socialLinks.twitter.trim();
    if (typeof body.socialLinks.instagram === 'string') dto.socialLinks.instagram = body.socialLinks.instagram.trim();
    if (typeof body.socialLinks.linkedin === 'string') dto.socialLinks.linkedin = body.socialLinks.linkedin.trim();
  }
  return dto;
}

function toPublicGetInTouch(doc) {
  if (!doc) return null;
  const g = doc.toObject ? doc.toObject() : doc;
  return {
    id: g._id?.toString?.() ?? g.id,
    address: g.address,
    phone: g.phone,
    email: g.email,
    socialLinks: g.socialLinks,
    createdAt: g.createdAt,
    updatedAt: g.updatedAt,
  };
}

module.exports = { toCreateGetInTouchDTO, toUpdateGetInTouchDTO, toPublicGetInTouch };