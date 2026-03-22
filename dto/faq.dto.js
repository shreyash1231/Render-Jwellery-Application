// DTOs for FAQ

function toCreateFaqDTO(body = {}) {
  return {
    question: typeof body.question === 'string' ? body.question.trim() : undefined,
    answer: typeof body.answer === 'string' ? body.answer.trim() : undefined,
    isActive: typeof body.isActive === 'boolean' ? body.isActive : undefined,
  };
}

function toUpdateFaqDTO(body = {}) {
  const dto = {};
  if (typeof body.question === 'string') dto.question = body.question.trim();
  if (typeof body.answer === 'string') dto.answer = body.answer.trim();
  if (typeof body.isActive === 'boolean') dto.isActive = body.isActive;
  return dto;
}

function toPublicFaq(doc) {
  if (!doc) return null;
  const f = doc.toObject ? doc.toObject() : doc;
  return {
    id: f._id?.toString?.() ?? f.id,
    question: f.question,
    answer: f.answer,
    isActive: f.isActive,
    createdAt: f.createdAt,
    updatedAt: f.updatedAt,
  };
}

module.exports = { toCreateFaqDTO, toUpdateFaqDTO, toPublicFaq };