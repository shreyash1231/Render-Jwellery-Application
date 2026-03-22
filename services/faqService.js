const FAQ = require("../models/faqModel");
const { toCreateFaqDTO, toUpdateFaqDTO, toPublicFaq } = require('../dto/faq.dto');

class FaqService {

    async createFAQ(data) {
        const dto = toCreateFaqDTO(data);
        const createdFaq = await FAQ.create(dto);
        return { success: true, message: "FAQ created successfully", data: toPublicFaq(createdFaq) };
    }

    async getAllFAQ() {
        const faqs = await FAQ.find().lean();
        if (!faqs.length) {
            throw new Error("No FAQs found");
        }
        return { success: true, message: "FAQs fetched successfully", data: faqs.map(toPublicFaq) };
    }

    async getByIdFAQ(id) {
        const faq = await FAQ.findById(id).lean();
        if (!faq) {
            throw new Error("FAQ not found");
        }
        return { success: true, message: "FAQ fetched successfully", data: toPublicFaq(faq) };
    }

    async updateFAQ(id, data) {
        const dto = toUpdateFaqDTO(data);
        const updatedFaq = await FAQ.findByIdAndUpdate(id, dto, { new: true, runValidators: true });
        if (!updatedFaq) {
            throw new Error("FAQ not found");
        }
        return { success: true, message: "FAQ updated successfully", data: toPublicFaq(updatedFaq) };
    }

    async deleteFAQ(id) {
        const deletedFaq = await FAQ.findByIdAndDelete(id);
        if (!deletedFaq) {
            throw new Error("FAQ not found");
        }
        return { success: true, message: "FAQ deleted successfully" };
    }
}

module.exports = new FaqService();