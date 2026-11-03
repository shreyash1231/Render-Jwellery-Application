const Marquee = require("../models/marqueeModel");

// Shown until the admin saves their own settings, so the bar never disappears on deploy
const DEFAULT_MARQUEE = {
  messages: [
    "Get 5% off on your 1st order, after you subscribe with us",
    "WE SUGGEST - FOR FAMILY WEDDINGS, BRIDESMAID OR BESTMAN GIFTING, CUSTOM ORDERS, CONTACT US DIRECTLY",
  ],
  textColor: "#f4e8dc",
  backgroundColor: "#2a2016",
  speed: 25,
  isActive: true,
};

class MarqueeService {
  async getMarquee() {
    const marquee = await Marquee.findOne().lean();
    return {
      success: true,
      message: "Marquee fetched successfully",
      data: marquee || DEFAULT_MARQUEE,
    };
  }

  async updateMarquee(data) {
    // On first save, fill any field the admin didn't send with the default
    // (Mongo rejects the same path in both $set and $setOnInsert)
    const defaults = Object.fromEntries(
      Object.entries(DEFAULT_MARQUEE).filter(([key]) => !(key in data))
    );

    const marquee = await Marquee.findOneAndUpdate(
      {},
      Object.keys(defaults).length
        ? { $set: data, $setOnInsert: defaults }
        : { $set: data },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    return {
      success: true,
      message: "Marquee updated successfully",
      data: marquee,
    };
  }
}

module.exports = new MarqueeService();
