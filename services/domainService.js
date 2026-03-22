// services/domainService.js
const Domain = require("../models/domainModel");
const { toCreateDomainDTO, toUpdateDomainDTO, toPublicDomain } = require('../dto/domain.dto');

class DomainService {
    async createDomain(data) {

        const findDomain = await Domain.findOne({ name: data.name })
        if (findDomain) {
            throw new Error('Domain allready Exist')
        }
        const domain = new Domain(data);
        await domain.save();
        return { success: true, message: "Domain created successfully", data: toPublicDomain(domain) };
    }

    async getAllDomains(filter = {}) {
        const domain = await Domain.find(filter).sort({ createdAt: -1 }).lean();
        if (!domain) {
            throw new Error("Domain not found")
        }
        return { success: true, message: "Domain fetched successfully", data: domain.map(toPublicDomain) };
    }

    async getDomainById(id) {
        const domain = await Domain.findById(id).lean();

        if (!domain) throw new Error("Domain not found");

        return { success: true, message: "Domain fetched successfully", data: toPublicDomain(domain) };
    }

    async updateDomain(id, data) {

        const domain = await Domain.findByIdAndUpdate(id, data, { new: true });

        if (!domain) throw new Error("Domain not found or could not be updated");

        return { success: true, message: "Domain updated successfully", data: toPublicDomain(domain) };
    }

    async deleteDomain(id) {
        const domain = await Domain.findByIdAndDelete(id);

        if (!domain) throw new Error("Domain not found or could not be deleted");

        return { success: true, message: "Domain deleted successfully" };
    }
}

module.exports = new DomainService();