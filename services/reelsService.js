const Reels = require("../models/reelModel");

class ReelsService {
  async createReel(data) {
    const reel = await Reels.create(data);

    return {
      success: true,
      message: "Reel created successfully",
      data: reel,
    };
  }

  async getReels() {
    const reels = await Reels.find({}).sort({ createdAt: -1 }).lean();

    return {
      success: true,
      data: reels,
    };
  }

  async getReelById(reelId) {
    const reel = await Reels.findById(reelId).lean();

    if (!reel) {
      throw new Error("Reel not found");
    }

    return {
      success: true,
      data: reel,
    };
  }

  async updateReel(reelId, data) {
    const reel = await Reels.findByIdAndUpdate(reelId, data, {
      new: true,
      runValidators: true,
    });

    if (!reel) {
      throw new Error("Reel not found");
    }

    return {
      success: true,
      message: "Reel updated successfully",
      data: reel,
    };
  }

  async deleteReel(reelId) {
    const reel = await Reels.findByIdAndDelete(reelId);

    if (!reel) {
      throw new Error("Reel not found");
    }

    return {
      success: true,
      message: "Reel deleted successfully",
    };
  }
}

module.exports = new ReelsService();
