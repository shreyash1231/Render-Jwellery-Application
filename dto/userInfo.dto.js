function toCreateUserInfoDTO(body = {}) {
  return {
    name: typeof body.name === "string" ? body.name.trim() : undefined,
    email: typeof body.email === "string" ? body.email.toLowerCase().trim() : undefined,
    mobileNumber:
      typeof body.mobileNumber === "string" ? body.mobileNumber.trim() : undefined,
    location: typeof body.location === "string" ? body.location.trim() : undefined,
  };
}

function toPublicUserInfo(doc) {
  if (!doc) return null;
  const u = doc.toObject ? doc.toObject() : doc;
  return {
    id: u._id?.toString?.() ?? u.id,
    name: u.name,
    email: u.email,
    mobileNumber: u.mobileNumber,
    location: u.location,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

module.exports = { toCreateUserInfoDTO, toPublicUserInfo };
