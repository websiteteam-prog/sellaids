// import {
//   createOrderFromCartService,
//   finalizeOrderPaymentService,
//   getOrdersForAdminService,
//   getUserPaymentSummaryService,
//   getVendorEarningsSummaryService
// } from "../../services/user/userOrderService.js";
import {
  createOrderFromCartService,
  finalizeOrderPaymentService
} from "../../services/user/userOrderService.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import logger from "../../config/logger.js";

// export const createOrderController = async (req, res, next) => {
//   try {
//     const userId = req.session?.user?.userId;
//     if (!userId) return errorResponse(res, 401, "Login required");

//     const { shipping_address } = req.body;
//     if (!shipping_address) return errorResponse(res, 400, "Shipping address required");

//     const result = await createOrderFromCartService(userId, shipping_address, true);
//     if (!result.success) return errorResponse(res, 400, result.message);

//     return successResponse(res, 201, result.message, result.data);
//   } catch (error) {
//     logger.error("createOrderController error:", error);
//     return errorResponse(res, 500);
//   }
// };

export const createOrderController = async (req, res) => {
  try {
    const userId = req.session?.user?.userId; 
    if (!userId) return errorResponse(res, 401, "User not logged in");

    const { total_amount, shipping_address, payment_provider, payment_id } = req.body;

    if (!shipping_address)
      return errorResponse(res, 400, "Shipping address is required");
    if (!total_amount)
      return errorResponse(res, 400, "Total amount is required");

    const orderData = { total_amount, shipping_address, payment_provider, payment_id };
    const newOrder = await createOrderService(userId, orderData);

    logger.info(`OrderController: Order created with ID ${newOrder.id}`);
    return successResponse(res, 201, "Order created successfully", newOrder);
  } catch (error) {
    logger.error(`OrderController Error: ${error.message}`);
    return errorResponse(res, 500, "Failed to create order", error.message);
  }
};

export const verifyPaymentController = async (req, res, next) => {
  try {
    const { order_id, provider, provider_payment_id, amount, meta } = req.body;
    if (!order_id || !provider || !provider_payment_id) return errorResponse(res, 400, "Invalid payment data");

    // NOTE: verify signature/hashing with gateway before calling finalize service
    const result = await finalizeOrderPaymentService(order_id, provider, provider_payment_id, amount, meta || {});
    if (!result.success) return errorResponse(res, 400, result.message);

    return successResponse(res, 200, result.message, result.data);
  } catch (error) {
    logger.error("verifyPaymentController error:", error);
    return errorResponse(res, 500, error.message || error);
  }
};

// Admin: get all orders with vendor names inside order items
// export const getOrdersForAdminController = async (req, res) => {
//   try {
//     // assume admin auth middleware
//     const result = await getOrdersForAdminService();
//     return successResponse(res, 200, "Orders fetched", result.data);
//   } catch (error) {
//     logger.error("getOrdersForAdminController error:", error);
//     return errorResponse(res, 500, error.message || error);
//   }
// };

// export const getUserPaymentSummaryController = async (req, res) => {
//   try {
//     const userId = req.session?.user?.userId;
//     if (!userId) return errorResponse(res, 401, "Login required");

//     const result = await getUserPaymentSummaryService(userId);
//     return successResponse(res, 200, "User payment summary", result.data);
//   } catch (error) {
//     logger.error("getUserPaymentSummaryController error:", error);
//     return errorResponse(res, 500, error.message || error);
//   }
// };

// export const getVendorEarningsController = async (req, res) => {
//   try {
//     const vendorId = req.session?.vendor?.vendorId || req.params.vendorId;
//     if (!vendorId) return errorResponse(res, 401, "Vendor login required");

//     const result = await getVendorEarningsSummaryService(vendorId);
//     return successResponse(res, 200, "Vendor earnings summary", result.data);
//   } catch (error) {
//     logger.error("getVendorEarningsController error:", error);
//     return errorResponse(res, 500, error.message || error);
//   }
// };