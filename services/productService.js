const Product = require('../models/productsModel');
const Category = require('../models/categoriesModal');
const Shoptolook = require('../models/shoptolook.model');
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
    if (categoryId) filter.categoryId = categoryId;

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

  /* ---------------- UPDATE PRODUCT ---------------- */
  async updateProduct(productId, productData) {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

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
