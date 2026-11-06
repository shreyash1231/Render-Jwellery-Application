const asyncHandler = require("../../utils/asyncHandler");
const collectionService = require("../../services/collectionService");
const successHandler = require("../../middleware/globalSuccessHandler");

// Homepage shows a preview of each collection; "View all" opens the full list
const HOME_PREVIEW_LIMIT = 4;

const collectionController = {
  getHomeCollections: asyncHandler(async (req, res) => {
    const result = await collectionService.getStorefrontCollections({ limit: HOME_PREVIEW_LIMIT });
    return successHandler(res, 200, result.message, result.data);
  }),

  getCollectionById: asyncHandler(async (req, res) => {
    const result = await collectionService.getStorefrontCollectionById(req.params.id);
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = collectionController;
