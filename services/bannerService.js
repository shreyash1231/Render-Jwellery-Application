const Banner = require("../models/bannerModel");
const {
  toCreateBannerDTO,
  toUpdateBannerDTO,
  toPublicBanner,
} = require("../dto/banner.dto");

class BannerService {
  async createBanner(data) {
    const dto = toCreateBannerDTO(data);
    const banner = new Banner(dto);
    await banner.save();
    return {
      success: true,
      message: "Banner created successfully",
      data: toPublicBanner(banner),
    };
  }

  async getAllBanners() {
    const banners = await Banner.find().sort({ createdAt: -1 }).lean();
    if (banners.length === 0) {
      throw new Error("Banners not found");
    }
    return {
      success: true,
      message: "Banners fetched successfully",
      data: banners.map(toPublicBanner),
    };
  }

  async getBannerById(id) {
    const banner = await Banner.findById(id).lean();
    if (!banner) {
      throw new Error("Banner not found");
    }
    return {
      success: true,
      message: "Banner fetched successfully",
      data: toPublicBanner(banner),
    };
  }

  async updateBanner(id, data) {
    const dto = toUpdateBannerDTO(data);
    const updatedBanner = await Banner.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });
    if (!updatedBanner) {
      throw new Error("Banner not found");
    }
    return {
      success: true,
      message: "Banner updated successfully",
      data: toPublicBanner(updatedBanner),
    };
  }

  async deleteBanner(id) {
    const deletedBanner = await Banner.findByIdAndDelete(id);
    if (!deletedBanner) {
      throw new Error("Banner not found");
    }
    return { success: true, message: "Banner deleted successfully" };
  }
}

module.exports = new BannerService();
