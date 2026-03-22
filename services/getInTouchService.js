const GetInTouch = require("../models/getInTouchModel");
const { toCreateGetInTouchDTO, toUpdateGetInTouchDTO, toPublicGetInTouch } = require('../dto/getInTouch.dto');

class GetInTouchService {
    async createGetInTouch(body) {
        // const dto = toCreateGetInTouchDTO(body);
        let data = await GetInTouch.create(body);
        return { success: true, message: "Details saved successfully", data: toPublicGetInTouch(data) }

    }

    async get() {
        let data = await GetInTouch.find().lean();
        return { success: true, message: "Details fetched successfully", data: data.map(toPublicGetInTouch) }
    }

    async getById(id) {
        const data = await GetInTouch.findById(id).lean();
        return toPublicGetInTouch(data);
    }
    async updateGetInTouch(id, body) {
        const dto = toUpdateGetInTouchDTO(body);
        let data = await GetInTouch.findByIdAndUpdate(id, dto, {
            new: true,
            runValidators: true,
        });

        return { success: true, message: "Details updated successfully", data: toPublicGetInTouch(data) }
    }

    async deleteGetInTouch(id) {
        await GetInTouch.findByIdAndDelete(id);
        return { success: true, message: "Deleted successfully" }

    }
}

module.exports = new GetInTouchService();