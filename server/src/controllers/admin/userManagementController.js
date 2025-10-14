import { getAllUsers } from "../../services/admin/userManagementService.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import logger from "../../config/config.js";

export const getAllUsersController = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const result = await getAllUsers({ search, page, limit });

    logger.info(`Fetched ${result?.users?.length} users (Page: ${page}, Limit: ${limit}, Search: "${search}")`);
    return successResponse(res, 200, "Fetched all users successfully", {
      total: result.total,
      page: parseInt(page),
      limit: parseInt(limit),
      users: result.users,
    });
  } catch (error) {
    logger.error("Error fetching users:", error);
    return errorResponse(res, 500, error);
  }
};
