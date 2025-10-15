import { getAllVendors } from "../../services/admin/vendorManagementService.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import logger from "../../config/logger.js"

export const getAllVendorsController = async (req, res) => {
    try {
        const { search = "", status = "All", page = 1, limit = 10 } = req.query;
        const result = await getAllVendors({ search, status, page, limit });

        return successResponse(res, 200, "Fetched all vendors successfully", {
            total: result.total,
            page: parseInt(page),
            limit: parseInt(limit),
            vendors: result.vendors,
        });
    } catch (error) {
        logger.error("Error fetching vendors:", error);
        return errorResponse(res, 500, error);
    }
};
