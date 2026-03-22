const { StaticContent }  = require("../models/contentModel");
const { toCreateStaticContentDTO, toUpdateStaticContentDTO, toPublicStaticContent } = require('../dto/content.dto');

class StaticContentService {

    async createStaticContent(data) {
        const dto = toCreateStaticContentDTO(data);
        const content = await StaticContent.create(dto);
        return { success: true, message: "Static content created successfully", data: toPublicStaticContent(content) };
    }

    async getAllStaticContents(filter = {}) {
        const contents = await StaticContent.find(filter).sort({ createdAt: -1 }).lean();
        if (!contents || contents.length === 0) {
            throw new Error("No static content found");
        }
        return { success: true, message: "Static contents fetched successfully", data: contents.map(toPublicStaticContent) };
    }

    async getStaticContentById(id) {
        const content = await StaticContent.findById(id).lean();
        if (!content) {
            throw new Error("Static content not found");
        }
        return { success: true, message: "Static content fetched successfully", data: toPublicStaticContent(content) };
    }

    async updateStaticContent(id, updateData) {
        const dto = toUpdateStaticContentDTO(updateData);
        const updatedContent = await StaticContent.findByIdAndUpdate(id, dto, { new: true, runValidators: true });
        if (!updatedContent) {
            throw new Error("Static content not found");
        }
        return { success: true, message: "Static content updated successfully", data: toPublicStaticContent(updatedContent) };
    }

    async deleteStaticContent(id) {
        const deletedContent = await StaticContent.findByIdAndDelete(id);
        if (!deletedContent) {
            throw new Error("Static content not found");
        }
        return { success: true, message: "Static content deleted successfully", data: toPublicStaticContent(deletedContent) };
    }

    async toggleStatus(id) {
        const content = await StaticContent.findById(id).lean();
        if (!content) {
            throw new Error("Static content not found");
        }
        content.isActive = !content.isActive;
        await content.save();
        return { success: true, message: `Static content ${content.isActive ? 'activated' : 'deactivated'} successfully`, data: toPublicStaticContent(content) };
    }

    async getStaticContentByType(type) {
        const content = await StaticContent.findOne({ type, isActive: true }).lean();
        if (!content) {
            throw new Error(`Active static content of type ${type} not found`);
        }
        return { success: true, message: "Static content fetched successfully", data: toPublicStaticContent(content) };
    }
}

module.exports = new StaticContentService();