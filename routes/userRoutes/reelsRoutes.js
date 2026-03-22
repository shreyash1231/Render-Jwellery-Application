const express = require("express");
const router = express.Router();

const reelsController = require("../../controller/adminController/reelsController");

router.get("/get-all-reels", reelsController.getReels);

router.get("/get-reel-by-id/:id", reelsController.getReelById);

module.exports = router;
