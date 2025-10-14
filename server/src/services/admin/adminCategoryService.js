import { Category } from "../../models/categoryModel.js";
import logger from "../../config/logger.js";

// Create Category
export const createCategoryService = async ({ name, parent_id = null, adminId }) => {
    try {
        let level = 1;

        if (parent_id) {
            const parentCategory = await Category.findByPk(parent_id);
            if (!parentCategory) throw new Error("Parent category not found");
            level = parentCategory.level + 1;
        }

        const category = await Category.create({ name, parent_id, level, adminId });

        logger.info(`Category created: ${name}`);
        return category;
    } catch (error) {
        logger.error("Error creating category:", error);
        throw error;
    }
};

// 🟢 Recursive helper function for nested structure
const buildCategoryTree = (categories, parentId = null) => {
    return categories
        .filter((cat) => cat.parent_id === parentId)
        .map((cat) => ({
            id: cat.id,
            name: cat.name,
            level: cat.level,
            subCategories: buildCategoryTree(categories, cat.id),
        }));
};

// 🟢 Get all categories
export const getAllCategoriesService = async (name) => {
    try {
        const categories = await Category.findAll({ raw: true });
        if (!name) {
            const tree = buildCategoryTree(categories);
            logger.info("Fetched all categories");
            return tree;
        }

        const foundCategory = categories.find(
            (cat) => cat.name.toLowerCase() === name.toLowerCase()
        );

        if (!foundCategory) {
            logger.warn(`Category with name "${name}" not found`);
            return [];
        }
        const subTree = buildCategoryTree(categories, foundCategory.id);
        const result = [
            {
                id: foundCategory.id,
                name: foundCategory.name,
                level: foundCategory.level,
                subCategories: subTree,
            },
        ];

        logger.info(`Fetched category tree for name: ${name}`);
        return result;
    } catch (error) {
        logger.error("Error fetching categories:", error);
        throw error;
    }
};