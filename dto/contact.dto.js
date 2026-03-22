
function toCreateContactDTO(body = {}) {
  return {
    firstName: typeof body.firstName === 'string' ? body.firstName.trim() : undefined,
    lastName: typeof body.lastName === 'string' ? body.lastName.trim() : undefined,
    email: typeof body.email === 'string' ? body.email.toLowerCase().trim() : undefined,
    phone: typeof body.phone === 'string' ? body.phone.trim() : undefined,
    message: typeof body.message === 'string' ? body.message.trim() : undefined,
  };
}

function toUpdateContactDTO(body = {}) {
  const dto = {};
  if (typeof body.firstName === 'string') dto.firstName = body.firstName.trim();
  if (typeof body.lastName === 'string') dto.lastName = body.lastName.trim();
  if (typeof body.email === 'string') dto.email = body.email.toLowerCase().trim();
  if (typeof body.phone === 'string') dto.phone = body.phone.trim();
  if (typeof body.subject === 'string') dto.subject = body.subject.trim();
  if (typeof body.message === 'string') dto.message = body.message.trim();
  return dto;
}

function toPublicContact(doc) {
  if (!doc) return null;
  const c = doc.toObject ? doc.toObject() : doc;
  return {
    id: c._id?.toString?.() ?? c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone,
    subject: c.subject,
    message: c.message,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}


module.exports = { toCreateContactDTO, toUpdateContactDTO, toPublicContact };

