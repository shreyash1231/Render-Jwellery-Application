const sharp = require("sharp");
const asyncHandler = require("../../utils/asyncHandler");
const errorHandler = require("../../middleware/globalErrorHandler");

// Public CDN in front of the S3 bucket; uploads are public, so thumbnails are too
const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL || "https://dpd52zzi6t5tf.cloudfront.net";
const WIDTHS = [80, 160, 320];
const MAX_CACHED = 500;

// Uploaded file names are unique and never overwritten, so a thumbnail never goes stale
const cache = new Map(); // key -> Promise<Buffer>

const makeThumb = async (path, width) => {
  const res = await fetch(`${IMAGE_BASE_URL}/${path}`);
  if (!res.ok) throw Object.assign(new Error("Image not found"), { statusCode: 404 });
  const original = Buffer.from(await res.arrayBuffer());
  return sharp(original)
    .rotate()
    .resize({ width, height: width, fit: "cover" })
    .webp({ quality: 75 })
    .toBuffer();
};

const imageController = {
  // GET /image-thumb?path=uploads/abc.jpg&w=160 -> small square webp for lists and pickers
  getThumbnail: asyncHandler(async (req, res) => {
    const path = String(req.query.path || "");
    const width = Number(req.query.w) || 160;

    if (!/^uploads\/[\w.-]+$/.test(path) || !WIDTHS.includes(width)) {
      return errorHandler({ statusCode: 400, message: "Invalid image" }, req, res);
    }

    const key = `${width}:${path}`;
    if (!cache.has(key)) {
      if (cache.size >= MAX_CACHED) cache.delete(cache.keys().next().value);
      cache.set(key, makeThumb(path, width));
    }

    let thumb;
    try {
      thumb = await cache.get(key);
    } catch (err) {
      cache.delete(key);
      return errorHandler({ statusCode: err.statusCode || 502, message: err.message }, req, res);
    }

    res.set({
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    });
    return res.send(thumb);
  }),
};

module.exports = imageController;
