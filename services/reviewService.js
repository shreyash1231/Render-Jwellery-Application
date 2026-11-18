const mongoose = require("mongoose");
const Review = require("../models/reviewModel");
const Product = require("../models/productsModel");
const User = require("../models/userModel");
const { ErrorResponse } = require("../utils/response");

const MAX_MEDIA = 10;
const SORTS = ["newest", "verified", "photos"];

const fullName = (u) => [u?.firstName, u?.lastName].filter(Boolean).join(" ").trim();

class ReviewService {
  // Average (1 decimal) and count of a product's visible reviews, saved on the product
  // so every product list can show stars without extra queries.
  async refreshProductRating(productId) {
    if (!productId) return;
    const [stats] = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(String(productId)), isActive: true } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    await Product.updateOne(
      { _id: productId },
      {
        $set: {
          ratingAverage: stats ? Math.round(stats.avg * 10) / 10 : 0,
          ratingCount: stats ? stats.count : 0,
        },
      }
    );
  }

  // Works out who the review is shown as: a linked customer or just a typed name
  async resolveReviewer(userId, reviewerName) {
    if (userId) {
      const user = await User.findById(userId).select("firstName lastName").lean();
      if (!user) throw new ErrorResponse("The selected customer no longer exists", 400);
      return { user: user._id, reviewerName: (reviewerName || "").trim() || fullName(user) || "Customer" };
    }
    const name = (reviewerName || "").trim();
    if (!name) throw new ErrorResponse("Enter the reviewer's name", 400);
    return { user: null, reviewerName: name };
  }

  async createReview(data, uploadedMedia = []) {
    const product = await Product.findById(data.product).select("_id").lean();
    if (!product) throw new ErrorResponse("The selected product no longer exists", 400);
    if (uploadedMedia.length > MAX_MEDIA) {
      throw new ErrorResponse(`Up to ${MAX_MEDIA} photos or videos per review`, 400);
    }

    const reviewer = await this.resolveReviewer(data.user, data.reviewerName);
    const review = await Review.create({
      product: data.product,
      ...reviewer,
      rating: data.rating,
      comment: data.comment || "",
      isVerifiedPurchase: !!data.isVerifiedPurchase,
      media: uploadedMedia,
      reviewedAt: data.reviewedAt || new Date(),
      isActive: data.isActive !== false,
    });

    await this.refreshProductRating(review.product);
    return { message: "Review added successfully", data: review };
  }

  async getAllReviews() {
    const reviews = await Review.find()
      .sort({ reviewedAt: -1 })
      .populate({
        path: "product",
        select: "name imageUrl ratingAverage ratingCount categoryId",
        populate: { path: "categoryId", select: "name" },
      })
      .populate({ path: "user", select: "firstName lastName email" })
      .lean();
    return { message: "Reviews fetched successfully", data: reviews };
  }

  async updateReview(id, data, uploadedMedia = []) {
    const review = await Review.findById(id);
    if (!review) throw new ErrorResponse("Review not found", 404);
    const oldProduct = String(review.product);

    if (data.product && String(data.product) !== oldProduct) {
      const product = await Product.findById(data.product).select("_id").lean();
      if (!product) throw new ErrorResponse("The selected product no longer exists", 400);
      review.product = data.product;
    }

    if (data.user !== undefined || data.reviewerName !== undefined) {
      const userId = data.user !== undefined ? data.user || null : review.user;
      const name = data.reviewerName !== undefined ? data.reviewerName : "";
      Object.assign(review, await this.resolveReviewer(userId, name));
    }

    ["rating", "comment", "isVerifiedPurchase", "reviewedAt", "isActive"].forEach((k) => {
      if (data[k] !== undefined) review[k] = data[k];
    });

    // Only media already on this review can be kept; new uploads are added after it
    if (data.keepMedia !== undefined || uploadedMedia.length) {
      const current = new Set(review.media.map((m) => m.url));
      const kept =
        data.keepMedia !== undefined
          ? data.keepMedia.filter((m) => current.has(m.url))
          : review.media.map((m) => ({ type: m.type, url: m.url }));
      const media = [...kept, ...uploadedMedia];
      if (media.length > MAX_MEDIA) {
        throw new ErrorResponse(`Up to ${MAX_MEDIA} photos or videos per review`, 400);
      }
      review.media = media;
    }

    await review.save();
    await this.refreshProductRating(review.product);
    if (oldProduct !== String(review.product)) await this.refreshProductRating(oldProduct);

    return { message: "Review updated successfully", data: review };
  }

  async deleteReview(id) {
    const review = await Review.findByIdAndDelete(id);
    if (!review) return { message: "Review already deleted" };
    await this.refreshProductRating(review.product);
    return { message: "Review deleted successfully" };
  }

  // Website: one page of a product's visible reviews plus the rating summary
  async getProductReviews(productId, { sort = "newest", page = 1, limit = 5 } = {}) {
    const sortKey = SORTS.includes(sort) ? sort : "newest";
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const size = Math.min(20, Math.max(1, parseInt(limit, 10) || 5));
    const match = { product: new mongoose.Types.ObjectId(String(productId)), isActive: true };

    const order = {
      newest: { reviewedAt: -1, _id: -1 },
      verified: { isVerifiedPurchase: -1, reviewedAt: -1, _id: -1 },
      photos: { hasMedia: -1, reviewedAt: -1, _id: -1 },
    }[sortKey];

    const [reviews, summaryRows] = await Promise.all([
      Review.aggregate([
        { $match: match },
        { $addFields: { hasMedia: { $gt: [{ $size: { $ifNull: ["$media", []] } }, 0] } } },
        { $sort: order },
        { $skip: (pageNum - 1) * size },
        { $limit: size },
        {
          $project: {
            reviewerName: 1,
            rating: 1,
            comment: 1,
            isVerifiedPurchase: 1,
            media: 1,
            reviewedAt: 1,
          },
        },
      ]),
      Review.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$rating",
            count: { $sum: 1 },
            verified: { $sum: { $cond: ["$isVerifiedPurchase", 1, 0] } },
            withMedia: { $sum: { $cond: [{ $gt: [{ $size: { $ifNull: ["$media", []] } }, 0] }, 1, 0] } },
          },
        },
      ]),
    ]);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;
    let sum = 0;
    let verified = 0;
    let withMedia = 0;
    summaryRows.forEach((r) => {
      distribution[r._id] = r.count;
      total += r.count;
      sum += r._id * r.count;
      verified += r.verified;
      withMedia += r.withMedia;
    });

    return {
      message: "Reviews fetched successfully",
      data: {
        reviews,
        page: pageNum,
        limit: size,
        total,
        hasMore: pageNum * size < total,
        summary: {
          average: total ? Math.round((sum / total) * 10) / 10 : 0,
          count: total,
          distribution,
          verified,
          withMedia,
        },
      },
    };
  }
}

module.exports = new ReviewService();
module.exports.SORTS = SORTS;
