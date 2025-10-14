import { getAllUsers, getAllVendors } from "../../services/admin/adminManagementService.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import logger from "../../config/logger.js";

// user management Controller
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

// vendor management Controller
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

// product management Controller
// export const getAllProductsController = async (req, res) => {
//   try {
//     const { search = "", status = "All", page = 1, limit = 10 } = req.query;
//     const result = await getAllProducts({ search, status, page, limit });

//     return successResponse(res, 200, "Fetched all products successfully", {
//       total: result.total,
//       page: parseInt(page),
//       limit: parseInt(limit),
//       products: result.products,
//     });
//   } catch (error) {
//     logger.error("Error fetching products:", error);
//     return errorResponse(res, 500, error);
//   }
// };