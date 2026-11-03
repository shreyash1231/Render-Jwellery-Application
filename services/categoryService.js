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
    const categories = await Category.find().populate("parentCategory", "name").lean();
    
    return {
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    };
  }

   async getShopByFuncCategories() {
    const categories = await Category.find({isShopByProduct:false}).populate("parentCategory", "name").lean();
    return {
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    };
  }

 async getShopByProdCategories() {
    const categories = await Category.find({isShopByProduct:true}).populate("parentCategory", "name").lean();
    return {
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    };
  }


  async getCategoryById(id) {
    const category = await Category.findById(id).populate("parentCategory", "name").lean();
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

  // Returns an error message if parentId can't be used as the parent of categoryId
  async validateParent(categoryId, parentId) {
    if (!parentId) return null;
    if (categoryId && String(parentId) === String(categoryId)) {
      return "A category cannot be its own parent";
    }

    // Walk up from the new parent; reaching categoryId would create a loop
    let current = await Category.findById(parentId).select("parentCategory").lean();
    if (!current) return "Parent category not found";
    while (categoryId && current?.parentCategory) {
      if (String(current.parentCategory) === String(categoryId)) {
        return "A category cannot be placed inside one of its own sub-categories";
      }
      current = await Category.findById(current.parentCategory).select("parentCategory").lean();
    }
    return null;
  }

  async deleteCategory(id) {
    const category = await Category.findByIdAndDelete(id);
    if (category) {
      // Sub-categories of a deleted category become top-level instead of pointing at nothing
      await Category.updateMany({ parentCategory: id }, { parentCategory: null });
    }
    return {
      success: true,
      message: "Category deleted successfully",
      data: category,
    };
  }
}

module.exports = new CategoryService();
