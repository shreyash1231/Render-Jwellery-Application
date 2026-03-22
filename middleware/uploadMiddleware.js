const multer = require("multer");

const storage = multer.memoryStorage();

const imageMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const videoMimeTypes = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

function fileFilter(req, file, cb) {
  if (
    imageMimeTypes.includes(file.mimetype) ||
    videoMimeTypes.includes(file.mimetype)
  ) {
    return cb(null, true);
  }

  cb(new Error("Only image and video files are allowed"), false);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB (safe for reels)
  },
});

module.exports = upload;

// const multer = require("multer");

// const memoryStorage = multer.memoryStorage();

// const allowedMimeTypes = [
//   "image/jpeg",
//   "image/png",
//   "image/webp",
//   "image/gif",
// ];

// function fileFilter(req, file, cb) {
//   if (!allowedMimeTypes.includes(file.mimetype)) {
//     return cb(new Error("Only image files are allowed"));
//   }
//   cb(null, true);
// }

// const upload = multer({
//   storage: memoryStorage,
//   fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB
//   },
// });

// module.exports = upload;
