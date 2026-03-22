const AboutUs = require("../models/aboutUsModel");

class AboutUsService {
  /* -------- CREATE -------- */
  async createAboutUs({ type, image }) {
    const exists = await AboutUs.findOne({ type });
    if (exists) {
      throw new Error(`${type} image already exists`);
    }

    const doc = await AboutUs.create({ type, image });

    return {
      success: true,
      message: `${type} image created successfully`,
      data: doc,
    };
  }

  /* -------- GET ALL -------- */
  async getAboutUs() {
    const data = await AboutUs.find().sort({ createdAt: 1 });

    return {
      success: true,
      message: "About Us fetched successfully",
      data,
    };
  }

  /* -------- UPDATE BY ID -------- */
  async updateAboutUs(id, image) {
    const aboutUs = await AboutUs.findById(id);
    if (!aboutUs) {
      throw new Error("About Us image not found");
    }

    aboutUs.image = image;
    await aboutUs.save();

    return {
      success: true,
      message: "Image updated successfully",
      data: aboutUs,
    };
  }

  /* -------- DELETE BY ID -------- */
  async deleteAboutUs(id) {
    const deleted = await AboutUs.findByIdAndDelete(id);

    return {
      success: true,
      message: deleted
        ? "Image deleted successfully"
        : "Image already deleted",
    };
  }
}

module.exports = new AboutUsService();
