import { addToCartService } from "../../services/user/userAddressService.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import logger from "../../config/logger.js";

export const addToCartController = async (req, res) => {
  try {
    if (!req.body) {
      logger.warn("Missing request body in addToCart");
      return res.status(400).json({ success: false, message: "Request body is missing" });
    }
    const { product_id } = req.body;
    const userId = req?.session?.user?.userId;

    if (!userId) {
      logger.warn("Unauthorized cart add attempt");
      return res.status(401).json({ success: false, message: "Unauthorized: User session missing" });
    }
    if (!product_id) {
      logger.warn("Missing product_id in addToCart");
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const result = await addToCartService(userId, product_id);

    if (!result.status) {
      return res.status(400).json({ success: false, message: result.message || "Failed to add to cart" });
    }

    logger.info(`Cart add successful for user ${userId}`);
    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: result.data,
    });
  } catch (error) {
    logger.error(`addToCartController Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};