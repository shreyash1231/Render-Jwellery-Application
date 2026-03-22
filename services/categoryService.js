const Category = require('../models/categoriesModal');

class CategoryService {
  async createCategory(data) {
    const category = await Category.create(data);
    return {
      success: true,
      message: "Category created successfully",
      data: category,
    };
  }

  async getAllCategories() {
    const categories = await Category.find().lean();
    
    return {
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    };
  }

   async getShopByFuncCategories() {
    const categories = await Category.find({isShopByProduct:false}).lean();
    console.log
    return {
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    };
  }

 async getShopByProdCategories() {
    const categories = await Category.find({isShopByProduct:true}).lean();
    return {
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    };
  }


  async getCategoryById(id) {
    const category = await Category.findById(id).lean();
    return {
      success: true,
      message: "Category fetched successfully",
      data: category,
    };
  }

  async updateCategory(id, data) {
    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
    }).lean();

    return {
      success: true,
      message: "Category updated successfully",
      data: category,
    };
  }

  async deleteCategory(id) {
    const category = await Category.findByIdAndDelete(id);
    return {
      success: true,
      message: "Category deleted successfully",
      data: category,
    };
  }
}

module.exports = new CategoryService();
