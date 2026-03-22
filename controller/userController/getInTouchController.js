const asyncHandler = require("../../utils/asyncHandler");
const getInTouchService = require("../../services/getInTouchService");
const successHandler = require("../../middleware/globalSuccessHandler");

const getInTouchController = {

    get: asyncHandler(async (req, res) => {
      
        const result = await getInTouchService.get();
        return successHandler(res, 200, result.message, result.data);
    }),


};

module.exports = getInTouchController;
