const asyncHandler = require("../../utils/asyncHandler");
const seoService = require("../../services/seoService");
const successHandler = require("../../middleware/globalSuccessHandler");

const seoController = {
  // Read by the website on the server to build <head> tags, robots.txt and scripts
  getSettings: asyncHandler(async (req, res) => {
    const result = await seoService.getSettings();
    return successHandler(res, 200, result.message, result.data);
  }),

  getSitemapData: asyncHandler(async (req, res) => {
    const result = await seoService.getSitemapData();
    return successHandler(res, 200, result.message, result.data);
  }),
};

module.exports = seoController;
