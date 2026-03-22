// DTOs for User: shape and sanitize input/output

// Input DTOs
function toRegisterUserDTO(body = {}) {
  return {
    name: typeof body.name === 'string' ? body.name.trim() : undefined,
    email: typeof body.email === 'string' ? body.email.toLowerCase().trim() : undefined,
    password: typeof body.password === 'string' ? body.password : undefined,
    // role is optional and restricted server-side; ignore arbitrary fields
    role: typeof body.role === 'string' ? body.role : undefined,
  };
}

function toLoginDTO(body = {}) {
  return {
    email: typeof body.email === 'string' ? body.email.toLowerCase().trim() : undefined,
    password: typeof body.password === 'string' ? body.password : undefined,
  };
}

function toChangePasswordDTO(body = {}) {
  return {
    oldPassword: typeof body.oldPassword === 'string' ? body.oldPassword : undefined,
    newPassword: typeof body.newPassword === 'string' ? body.newPassword : undefined,
    confirmPassword: typeof body.confirmPassword === 'string' ? body.confirmPassword : undefined,
  };
}

// Output DTOs (remove sensitive fields)
function toPublicUser(userDoc) {
  if (!userDoc) return null;
  const u = userDoc.toObject ? userDoc.toObject() : userDoc;
  return {
    id: u._id?.toString?.() ?? u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    name: [u.firstName, u.lastName].filter(Boolean).join(' ').trim(),
    email: u.email,
    profilePic: u.profilePic,
    authProvider: u.authProvider,
    isVerified: u.isVerified,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

module.exports = {
  toRegisterUserDTO,
  toLoginDTO,
  toChangePasswordDTO,
  toPublicUser,
};
