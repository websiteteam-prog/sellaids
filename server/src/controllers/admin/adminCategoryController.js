import { createCategoryService, getAllCategoriesService } from "../../services/admin/adminCategoryService.js";
import { createCategorySchema } from "../../validations/categoryValidation.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import logger from "../../config/logger.js";

export const createCategoryController = async (req, res) => {
    try {
        const adminId = req?.session?.admin?.adminId;
        const validatedData = await createCategorySchema.validate(req.body, {
            abortEarly: false,
        })
        const { name, parent_id } = validatedData;

        const category = await createCategoryService({ adminId, name, parent_id });
        logger.info(`Category created: ${category.name} by Admin ${adminId}`);

        return successResponse(res, 201, "Category created successfully", category);
    } catch (err) {
        logger.error(`Category creation error: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};

export const getAllCategoriesController = async (req, res) => {
    try {
        const { name } = req.query;
        const data = await getAllCategoriesService(name);
        return successResponse(res, 200, "All categories fetched", data);
    } catch (err) {
        return errorResponse(res, 500, err);
    }
};