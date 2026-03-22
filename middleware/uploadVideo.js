const multer = require("multer");

const storage = multer.memoryStorage();

const allowedVideoTypes = [
  "video/mp4",
  "video/webm",
  "video/quicktime", // .mov
  "video/x-matroska", // .mkv
];

const videoFileFilter = (req, file, cb) => {
  if (!allowedVideoTypes.includes(file.mimetype)) {
    return cb(
      new Error("Only video files are allowed (mp4, webm, mov, mkv)"),
      false
    );
  }
  cb(null, true);
};

const uploadVideo = multer({
  storage,
  fileFilter: videoFileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

module.exports = uploadVideo;
