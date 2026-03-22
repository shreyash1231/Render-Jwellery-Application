// DTOs for Team

function toCreateTeamDTO(body = {}) {
  return {
    name: typeof body.name === 'string' ? body.name.trim() : undefined,
    designation: typeof body.designation === 'string' ? body.designation.trim() : undefined,
    imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl.trim() : undefined,
    socialLinks: typeof body.socialLinks === 'object' && body.socialLinks !== null ? {
      facebook: typeof body.socialLinks.facebook === 'string' ? body.socialLinks.facebook.trim() : undefined,
      twitter: typeof body.socialLinks.twitter === 'string' ? body.socialLinks.twitter.trim() : undefined,
      instagram: typeof body.socialLinks.instagram === 'string' ? body.socialLinks.instagram.trim() : undefined,
      linkedin: typeof body.socialLinks.linkedin === 'string' ? body.socialLinks.linkedin.trim() : undefined,
    } : undefined,
  };
}

function toUpdateTeamDTO(body = {}) {
  const dto = {};
  if (typeof body.name === 'string') dto.name = body.name.trim();
  if (typeof body.designation === 'string') dto.designation = body.designation.trim();
  if (typeof body.imageUrl === 'string') dto.imageUrl = body.imageUrl.trim();
  if (typeof body.socialLinks === 'object' && body.socialLinks !== null) {
    dto.socialLinks = {};
    if (typeof body.socialLinks.facebook === 'string') dto.socialLinks.facebook = body.socialLinks.facebook.trim();
    if (typeof body.socialLinks.twitter === 'string') dto.socialLinks.twitter = body.socialLinks.twitter.trim();
    if (typeof body.socialLinks.instagram === 'string') dto.socialLinks.instagram = body.socialLinks.instagram.trim();
    if (typeof body.socialLinks.linkedin === 'string') dto.socialLinks.linkedin = body.socialLinks.linkedin.trim();
  }
  return dto;
}

function toPublicTeam(doc) {
  if (!doc) return null;
  const t =doc;
  return {
    id: t._id?.toString?.() ?? t.id,
    name: t.name,
    designation: t.designation,
    imageUrl: t.imageUrl,
    //socialLinks: t.socialLinks,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

module.exports = { toCreateTeamDTO, toUpdateTeamDTO, toPublicTeam };