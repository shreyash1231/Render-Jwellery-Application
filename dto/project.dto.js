// DTOs for Project

function toCreateProjectDTO(body = {}) {
  return {
    title: typeof body.title === 'string' ? body.title.trim() : undefined,
    description: typeof body.description === 'string' ? body.description.trim() : undefined,
    country: typeof body.country === 'string' ? body.country.trim() : undefined,
    imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl.trim() : undefined,
    type: typeof body.type === 'string' ? body.type : undefined,
    domainId: typeof body.domainId === 'string' ? body.domainId : undefined,
  };
}

function toUpdateProjectDTO(body = {}) {
  const dto = {};
  if (typeof body.title === 'string') dto.title = body.title.trim();
  if (typeof body.description === 'string') dto.description = body.description.trim();
  if (typeof body.country === 'string') dto.country = body.country.trim();
  if (typeof body.imageUrl === 'string') dto.imageUrl = body.imageUrl.trim();
  if (typeof body.domain === 'string') dto.domain = body.domain.trim();
  if (typeof body.type === 'string') dto.type = body.type;
  if (typeof body.isActive === 'boolean') dto.isActive = body.isActive;
  return dto;
}

function toPublicProject(doc) {
  if (!doc) return null;
  const p = doc.toObject ? doc.toObject() : doc;

  return {
    id: p._id?.toString?.() ?? p.id,
    title: p.title,
    description: p.description,
    country: p.country,
    imageUrl: p.imageUrl,
    domain: p.domainId && typeof p.domainId === "object"
      ? { 
          id: p.domainId._id.toString(), 
          name: p.domainId.name 
        } // populated hone par id + name
      : p.domainId?.toString?.(), // agar sirf ObjectId ho
    type: p.type,
    isActive: p.isActive,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}


module.exports = { toCreateProjectDTO, toUpdateProjectDTO, toPublicProject };