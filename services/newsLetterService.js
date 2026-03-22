// services/newsletterService.js
const Newsletter = require("../models/newsLetter");
const {
  toCreateNewsletterDTO,
  toUpdateNewsletterDTO,
  toPublicNewsletter,
} = require("../dto/newsletter.dto");

class NewsletterService {
  async createNewsletter(data) {
    const newsletter = await Newsletter.find({
      email: data.email,
    }).lean();

    if (newsletter.length > 0) {
      throw new Error("Email already exist");
    }

    const newNewsletter = new Newsletter(data);
    await newNewsletter.save();

    return {
      success: true,
      message: "Email added successfully",
      data: toPublicNewsletter(newNewsletter),
    };
  }

  // services/newsletterService.js
  async getAllNewsletters(filter = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [total, newsletters] = await Promise.all([
      Newsletter.countDocuments(filter),
      Newsletter.find(filter).sort({ createdAt: -1 }),
      // .skip(skip)
      // .limit(limit)
    ]);

    if (newsletters.length === 0) {
      throw new Error("No newsletters found");
    }

    return {
      success: true,
      message: "Data fetched successfully",
      data: newsletters.map(toPublicNewsletter),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getNewsletterById(id) {
    const newsletter = await Newsletter.findById(id).lean();
    if (!newsletter) throw new Error("Newsletter not found");
    return {
      success: true,
      message: "Data fetched successfully",
      data: toPublicNewsletter(newsletter),
    };
  }

  async updateNewsletter(id, data) {
    const dto = toUpdateNewsletterDTO(data);
    const newsletter = await Newsletter.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!newsletter) throw new Error("Newsletter not found");
    return {
      success: true,
      message: "Data fetched successfully",
      data: toPublicNewsletter(newsletter),
    };
  }

  async deleteNewsletter(id) {
    const newsletter = await Newsletter.findByIdAndDelete(id);
    if (!newsletter) throw new Error("Newsletter not found");
    return {
      success: true,
      message: "Data fetched successfully",
      data: toPublicNewsletter(newsletter),
    };
  }
}

module.exports = new NewsletterService();
