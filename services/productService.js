const Product = require('../models/productsModel');
const Category = require('../models/categoriesModal');
const Shoptolook = require('../models/shoptolook.model');
const ProductCategory = require('../models/productCategoryModel');
const { uniqueSlug, findByKey } = require('../utils/slug');

const cleanTags = (tags) =>
  [...new Set((tags || []).map((t) => String(t).trim().toLowerCase()).filter(Boolean))];
class ProductService {

  async createshoptolookServiceProduct(data) {
    const product = await Shoptolook.create(data); // ✅ use Shoptolook not shoptolook

    return {
      success: true,
      message: "Product created successfully",
      data: product,
    };
  }


    async getallbestSellerProducts(query) {
    const { limit = 4 } = query; // max 4 products
  
    const filter = {
      bestSeller: true,
      isActive: true,
    };
  
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate({
          path: 'categoryId',
          select: 'name isShopByProduct',
        })
        .limit(Number(limit)) 
        .sort({ createdAt: -1 }),
  
      Product.countDocuments(filter),
    ]);
  
    const mappedProducts = products.map((p) => {
      const discountPercent = Math.round(
        ((p.mrp - p.sellingPrice) / p.mrp) * 100
      );
  
      return {
        ...p.toObject(),
        discountPercent,
      };
    });
  
    return {
      success: true,
      message: 'Best seller products fetched successfully',
      data: {
        products: mappedProducts,
        totalItems: total,
        count: mappedProducts.length, // how many returned (max 4)
      },
    };
  }
  /* -
  
  --------------- CREATE PRODUCT ---------------- */
  async createProduct(productData) {
    // 🔐 Normalize prices
    const sellingPrice = Number(productData.sellingPrice);
    if (!sellingPrice || sellingPrice <= 0) {
      throw new Error('Selling price is required');
    }

    const mrp = productData.mrp ? Number(productData.mrp) : sellingPrice;
    if (sellingPrice > mrp) {
      throw new Error('Selling price cannot be greater than MRP');
    }

    productData.sellingPrice = sellingPrice;
    productData.mrp = mrp;
    productData.quantity = Number(productData.quantity || 0);

    // ✅ FAQs: ensure array (extra safety, Joi already validates)
    if (productData.faqs && !Array.isArray(productData.faqs)) {
      throw new Error('FAQs must be an array');
    }

    productData.slug = await uniqueSlug(Product, productData.slug || productData.name);
    if (productData.tags) productData.tags = cleanTags(productData.tags);

    const product = await Product.create(productData);

    if (product.quantity > 0) {
      await Category.findByIdAndUpdate(
        product.categoryId,
        { $inc: { stocks: product.quantity } },
        { new: true },
      );
    }

    return {
      success: true,
      message: 'Product created successfully',
      data: product,
    };
  }

  async getAllShoptolookService() {
    const products = await Shoptolook.find().sort({ createdAt: -1 }).lean();

    return {
      success: true,
      message: "Shoptolook products fetched successfully",
      data: products,
    };
  }
    /* ---------------- GET ALL PRODUCTS ---------------- */
  async getAllProducts(query) {
    const { page = 1, limit = 40, categoryId } = query;

    const filter = {};
    if (categoryId) {
      // Main category, or an active extra category set on the Multi Category page
      const extraIds = await ProductCategory.find({ category: categoryId, isActive: true }).distinct('product');
      filter.$or = [{ categoryId }, { _id: { $in: extraIds } }];
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate({
          path: 'categoryId',
          select: 'name isShopByProduct',
        })
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),

      Product.countDocuments(filter),
    ]);

    const mappedProducts = products.map((p) => {
      const discountPercent = Math.round(
        ((p.mrp - p.sellingPrice) / p.mrp) * 100,
      );

      return {
        ...p.toObject(),
        discountPercent,
      };
    });

    return {
      success: true,
      message: 'Products fetched successfully',
      data: {
        products: mappedProducts,
        pagination: {
          totalItems: total,
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          pageSize: Number(limit),
        },
      },
    };
  }

  /* ---------------- GET PRODUCT BY ID ---------------- */
  async getProductById(productId) {
    const product = await Product.findById(productId).populate({
      path: 'categoryId',
      select: 'name isShopByProduct',
    });
    console.log("prrr",product)
    if (!product) throw new Error('Product not found');

    const discountPercent = Math.round(
      ((product.mrp - product.sellingPrice) / product.mrp) * 100,
    );

    return {
      success: true,
      message: 'Product fetched successfully',
      data: {
        ...product.toObject(),
        discountPercent,
      },
    };
  }

  /* ---------------- GET PRODUCT BY ID OR SLUG (website) ---------------- */
  async getProductByKey(key) {
    const product = await findByKey(Product, key, { path: 'categoryId', select: 'name isShopByProduct slug' });
    if (!product) {
      return { success: false, message: 'Product not found', data: null };
    }
    const discountPercent = product.mrp
      ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
      : 0;
    return {
      success: true,
      message: 'Product fetched successfully',
      data: { ...product.toObject(), discountPercent },
    };
  }

  /* ---------------- RELATED PRODUCTS ---------------- */
  // Ranked by how many tags they share with the product, then filled from its categories
  async getRelatedProducts(key, limit = 12) {
    const max = Math.min(Math.max(Number(limit) || 12, 1), 40);
    const product = await findByKey(Product, key);
    if (!product) {
      return { success: true, message: 'Related products fetched successfully', data: { products: [] } };
    }

    const extraCategoryIds = await ProductCategory.find({ product: product._id, isActive: true }).distinct('category');
    const categoryIds = [product.categoryId, ...extraCategoryIds].filter(Boolean);
    const inSameCategory = await ProductCategory.find({ category: { $in: categoryIds }, isActive: true }).distinct('product');

    const tags = product.tags || [];
    const ranked = [];
    if (tags.length) {
      const byTags = await Product.aggregate([
        { $match: { _id: { $ne: product._id }, isActive: true, tags: { $in: tags } } },
        { $addFields: { shared: { $size: { $setIntersection: ['$tags', tags] } } } },
        { $sort: { shared: -1, createdAt: -1 } },
        { $limit: max },
        { $project: { _id: 1 } },
      ]);
      ranked.push(...byTags.map((p) => p._id));
    }

    if (ranked.length < max) {
      const fill = await Product.find({
        _id: { $nin: [product._id, ...ranked] },
        isActive: true,
        $or: [{ categoryId: { $in: categoryIds } }, { _id: { $in: inSameCategory } }],
      })
        .sort({ createdAt: -1 })
        .limit(max - ranked.length)
        .select('_id')
        .lean();
      ranked.push(...fill.map((p) => p._id));
    }

    const docs = await Product.find({ _id: { $in: ranked } }).populate({
      path: 'categoryId',
      select: 'name isShopByProduct slug',
    });
    const order = new Map(ranked.map((id, i) => [String(id), i]));
    const products = docs
      .sort((a, b) => order.get(String(a._id)) - order.get(String(b._id)))
      .map((p) => ({
        ...p.toObject(),
        discountPercent: p.mrp ? Math.round(((p.mrp - p.sellingPrice) / p.mrp) * 100) : 0,
      }));

    return { success: true, message: 'Related products fetched successfully', data: { products } };
  }

  /* ---------------- UPDATE PRODUCT ---------------- */
  async updateProduct(productId, productData) {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

    // Slug: an empty value means "make it from the name". The old one is kept so old links still work.
    if ('slug' in productData || !product.slug) {
      const wanted = productData.slug || productData.name || product.name;
      const next = await uniqueSlug(Product, wanted, product._id);
      if (product.slug && product.slug !== next && !product.slugHistory.includes(product.slug)) {
        product.slugHistory.push(product.slug);
      }
      product.slugHistory = product.slugHistory.filter((s) => s !== next);
      product.slug = next;
      delete productData.slug;
    }
    if (productData.tags) productData.tags = cleanTags(productData.tags);

    if (
      productData.mrp &&
      productData.sellingPrice &&
      productData.sellingPrice > productData.mrp
    ) {
      throw new Error('Selling price cannot be greater than MRP');
    }

    // ✅ Image append logic (unchanged)
    if (productData.imageUrl) {
      const images = Array.isArray(productData.imageUrl)
        ? productData.imageUrl
        : [productData.imageUrl];

      product.imageUrl = [...(product.imageUrl || []), ...images];
      delete productData.imageUrl;
    }

    // ✅ FAQs handling (REPLACE if provided)
    if (productData.faqs) {
      if (!Array.isArray(productData.faqs)) {
        throw new Error('FAQs must be an array');
      }
      product.faqs = productData.faqs;
      delete productData.faqs;
    }

    Object.keys(productData).forEach((key) => {
      product[key] = productData[key];
    });

    await product.save();

    return {
      success: true,
      message: 'Product updated successfully',
      data: product,
    };
  }

  /* ---------------- DELETE PRODUCT ---------------- */
  async deleteProduct(productId) {
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return {
        success: true,
        message: 'Product already deleted',
      };
    }

    await Category.findOneAndUpdate(
      { _id: product.categoryId },
      { $inc: { stocks: -product.quantity } },
    );
    await ProductCategory.deleteMany({ product: product._id });

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }

  /* ---------------- DELETE PRODUCT IMAGE ---------------- */
  async deleteProductImage(productId, imageUrl) {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

    if (!product.imageUrl.includes(imageUrl)) {
      throw new Error('Image not found');
    }

    product.imageUrl = product.imageUrl.filter((img) => img !== imageUrl);
    await product.save();

    return {
      success: true,
      message: 'Image deleted successfully',
      data: product,
    };
  }
}

module.exports = new ProductService();
