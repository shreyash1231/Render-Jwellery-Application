const express = require("express");
const router = express.Router();

const reelsController = require("../../controller/adminController/reelsController");
const uploadVideo = require("../../middleware/uploadVideo");
const upload = require("../../middleware/uploadMiddleware");
const { uploadLimiter } = require("../../middleware/rateLimiters");

router.post(
  "/add-reels",
  uploadLimiter,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  reelsController.createReel,
);

router.get("/get-all-reels", reelsController.getReels);

router.get("/get-reel-by-id/:id", reelsController.getReelById);

router.patch(
  "/update-reel/:id",
  uploadLimiter,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  reelsController.updateReel,
);

router.delete("/delete-reel/:id", reelsController.deleteReel);

module.exports = router;
