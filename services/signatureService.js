const Signature = require("../models/signatureModel");
const { signatureDTO, signatureDTOArray } = require("../dto/signature.dto");

class SignatureService {
  async createSignature(signatureData) {
    if (!signatureData.imageUrl) {
      throw new Error("Image URL is required");
    }
    if (!signatureData.layoutType) {
      throw new Error("Layout type is required");
    }
    if (!signatureData.order) {
      throw new Error("Order is required");
    }

    // Multiple signatures can have the same order number
    // This allows multiple images to be displayed at the same grid position
    const signature = await Signature.create({
      imageUrl: signatureData.imageUrl,
      layoutType: signatureData.layoutType,
      order: signatureData.order,
    });

    return {
      success: true,
      message: "Signature created successfully",
      data: signatureDTO(signature),
    };
  }

  async getAllSignatures() {
    // Sort by order (ascending), then by creation date for consistent ordering
    // Multiple signatures can have the same order number
    const signatures = await Signature.find().sort({ order: 1, createdAt: 1 });

    return {
      success: true,
      message: "Signatures fetched successfully",
      data: signatureDTOArray(signatures),
    };
  }

  async getSignatureById(signatureId) {
    const signature = await Signature.findById(signatureId);

    if (!signature) {
      throw new Error("Signature not found");
    }

    return {
      success: true,
      message: "Signature fetched successfully",
      data: signatureDTO(signature),
    };
  }

  async updateSignature(signatureId, signatureData) {
    const signature = await Signature.findByIdAndUpdate(
      signatureId,
      {
        ...signatureData,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!signature) {
      throw new Error("Signature not found");
    }

    return {
      success: true,
      message: "Signature updated successfully",
      data: signatureDTO(signature),
    };
  }

  async deleteSignature(signatureId) {
    const signature = await Signature.findByIdAndDelete(signatureId);

    if (!signature) {
      throw new Error("Signature not found");
    }

    return {
      success: true,
      message: "Signature deleted successfully",
      data: signatureDTO(signature),
    };
  }
}

module.exports = new SignatureService();
