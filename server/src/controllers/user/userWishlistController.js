import { addToWishlistService, removeFromWishlistService, getAllWishlistService } from "../../services/user/userWishlistService.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import logger from "../../config/logger.js";

export const addWishlistController = async (req, res) => {
  try {
    const userId = req.session?.user?.userId;
    const { product_id } = req.body;

    if (!userId || !product_id)
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required"
      })

    const result = await addToWishlistService(userId, product_id);
    console.log(result.data)
    if (!result.success)
      return errorResponse(res, 400, result.message);

    return successResponse(res, 201, "Product added to wishlist", result.data);
  } catch (error) {
    logger.error("addWishlist Controller Error:", error);
    return errorResponse(res, 500, error);
  }
};

export const removeWishlistController = async (req, res) => {
  try {
    const userId = req.session?.user?.userId;
    const { productId } = req.params;

    if (!userId || !productId)
      return errorResponse(res, 400, "User ID and Product ID are required");

    const result = await removeFromWishlistService(userId, productId);
    if (!result.success)
      return errorResponse(res, 404, result.message);

    return successResponse(res, 200, "Product removed from wishlist");
  } catch (error) {
    logger.error("removeWishlist Controller Error:", error);
    return errorResponse(res, 500, error);
  }
};

export const getAllWishlistController = async (req, res) => {
  try {
    const userId = req.session?.user?.userId;
    if (!userId) return errorResponse(res, 401, "User not logged in");

    const result = await getAllWishlistService(userId);
    return successResponse(res, 200, "Wishlist fetched successfully", result.data);
  } catch (error) {
    logger.error("getAllWishlist Controller Error:", error);
    return errorResponse(res, 500, error);
  }
};