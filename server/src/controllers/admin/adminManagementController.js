import { getAdminDashboardService, getAllUsers, getPaymentsWithFiltersService, getAllProductsService, getProductByIdService, updateProductStatusService, getVendorByIdService, updateVendorStatusService, getAllVendorsService, getAllOrdersService, getOrderDetailsService } from "../../services/admin/adminManagementService.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import logger from "../../config/logger.js";

// admin dashboard Management
export const getAdminDashboardController = async (req, res) => {
  try {
    const data = await getAdminDashboardService();
    return successResponse(res, 200, "Dashboard data fetched successfully", data);
  } catch (error) {
    logger.error(`Dashboard fetch failed: ${error.message}`);
    return errorResponse(res, 500, error);
  }
};

// user management Controller
export const getAllUsersController = async (req, res) => {
  try {
    const search = req.query.search || req.query.name || req.query.email || req.query.phone || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await getAllUsers({ search, page, limit });

    const filteredUsers = result?.users?.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      state: user.state,
      created_at: user.created_at
    }));

    logger.info(`Fetched ${result?.users?.length} users (Page: ${page}, Limit: ${limit}, Search: "${search}")`);
    return successResponse(res, 200, "Fetched all users successfully", {
      total: result.total,
      page: parseInt(page),
      limit: parseInt(limit),
      users: filteredUsers,
    });
  } catch (error) {
    logger.error("Error fetching users:", error);
    return errorResponse(res, 500, error);
  }
};

export const getAllVendorsController = async (req, res) => {
  try {
    const search = req.query.search || req.query.name || req.query.email || req.query.phone || "";
    const status = req.query.status || "all";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getAllVendorsService({ search, status, page, limit });

    return successResponse(res, 200, "Fetched vendors successfully", {
      total: result.total,
      page,
      limit,
      vendors: result.vendors,
    });
  } catch (error) {
    logger.error("Error fetching vendors:", error);
    return errorResponse(res, 500, error.message || "Error fetching vendors");
  }
};

// Get vendor by ID
export const getVendorByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await getVendorByIdService(id);

    if (!vendor) {
      return errorResponse(res, 404, "Vendor not found");
    }

    return successResponse(res, 200, "Vendor details fetched", vendor);
  } catch (error) {
    logger.error("Error fetching vendor:", error);
    return errorResponse(res, 500, error.message || "Error fetching vendor");
  }
};

// Update vendor status
export const updateVendorStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedVendor = await updateVendorStatusService(id, status);

    return successResponse(res, 200, "Vendor status updated", updatedVendor);
  } catch (error) {
    logger.error("Error updating vendor status:", error);
    return errorResponse(res, 500, error.message || "Error updating vendor status");
  }
};

// product management Controller
export const getAllProductsController = async (req, res) => {
  try {
    // Accept both search or model_name param
    const search = req.query.search || req.query.model_name || req.query.sku || "";
    const status = req.query.status || "all";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getAllProductsService({ search, status, page, limit });

    return successResponse(res, 200, "Fetched products successfully", {
      total: result.total,
      page,
      limit,
      products: result.products,
    });
  } catch (error) {
    logger.error("Error fetching products:", error);
    return errorResponse(res, 500, error.message || "Error fetching products");
  }
};

export const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(id);
    if (!product) return successResponse(res, 200, "No product found", null);

    return successResponse(res, 200, "Product details fetched", product);
  } catch (error) {
    logger.error("Error fetching product details:", error);
    return errorResponse(res, 500, error.message || "Error fetching product details");
  }
};

export const updateProductStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const product = await updateProductStatusService(id, status);
    if (!product) return successResponse(res, 200, "Product not found or invalid status", null);

    return successResponse(res, 200, `Product ${status} successfully`, product);
  } catch (error) {
    logger.error("Error updating product status:", error);
    return errorResponse(res, 500, error.message || "Error updating product status");
  }
};

// orders management Controller
export const getAllOrders = async (req, res) => {
  try {
    const filters = {
      order_id: req.query.order_id || null,
      status: req.query.status || "all",
      start_date: req.query.start_date || null,
      end_date: req.query.end_date || null,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    };

    const { orders, counts, pagination  } = await getAllOrdersService(filters);

    logger.info("Fetched all orders successfully");
    return successResponse(res, 200, "Orders fetched successfully", { counts, orders, pagination  });
  } catch (error) {
    logger.error(`Error fetching orders: ${error.message}`);
    return errorResponse(res, 500, error);
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderDetailsService(id);

    if (!order) {
      return errorResponse(res, 404, "Order not found");
    }

    logger.info(`Fetched details for order ID: ${id}`);
    return successResponse(res, 200, "Order details fetched successfully", order);
  } catch (error) {
    logger.error(`Error fetching order details: ${error.message}`);
    return errorResponse(res, 500, error);
  }
};

// payment Managemnet Controller
export const getPaymentsController = async (req, res) => {
  try {
    const filters = {
      status: req.query.status || "all",
      start_date: req.query.start_date || null,
      end_date: req.query.end_date || null,
      transaction_id: req.query.transaction_id || null,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    };
    const result = await getPaymentsWithFiltersService(filters);
    logger.info("Fetched filtered payments");
    return successResponse(res, 200, "Payments fetched successfully", {
      data: result.payments,
      pagination: {
        totalItems: result.total,
        totalPages: result.totalPages,
        currentPage: filters.page,
        limit: filters.limit,
      },
    });
  } catch (err) {
    logger.error("Error fetching payments:", err.message);
    return errorResponse(res, 500, err);
  }
};