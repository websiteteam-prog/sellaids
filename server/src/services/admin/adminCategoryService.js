import { Category } from "../../models/categoryModel.js";

export const createCategoryService = async (adminId, categoryData) => {
    const existing = await Category.findOne({});
    if (existing) throw new Error("Category already created");

    const category = await Category.create({
        ...categoryData,
        created_by: adminId
    });

    return category;
};