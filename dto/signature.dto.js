const signatureDTO = (signature) => {
  if (!signature) return null;

  return {
    id: signature._id,
    imageUrl: signature.imageUrl,
    layoutType: signature.layoutType,
    order: signature.order,
    createdAt: signature.createdAt,
    updatedAt: signature.updatedAt,
  };
};

const signatureDTOArray = (signatures) => {
  return signatures.map(signatureDTO);
};

module.exports = {
  signatureDTO,
  signatureDTOArray,
};
