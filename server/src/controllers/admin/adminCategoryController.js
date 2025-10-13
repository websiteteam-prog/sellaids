import { createCategoryService } from "../../services/admin/adminCategoryService.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import logger from "../../config/logger.js";

export const createCategoryController = async (req, res) => {
    try {
        const adminId = req?.session?.admin?.adminId;
        const categoryData = req.body;

        const category = await createCategoryService(adminId, categoryData);
        logger.info(`Category created by Admin ID: ${adminId}`);

        return successResponse(res, 201, "Category created successfully", category);
    } catch (err) {
        logger.error(`Category creation error: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};
