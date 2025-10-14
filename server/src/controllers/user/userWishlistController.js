import {
    addToWishlistService,
    removeFromWishlistService,
    getAllWishlistService,
} from "../services/wishlist.service.js";
import { successResponse, errorResponse } from "../helpers/responseHandler.js";
import logger from "../config/logger.js";

export const addToWishlist = async (req, res, next) => {
    try {
        const { product_id } = req.body;
        const userId = req?.session?.user?.userId;

        if (!userId) {
            logger.warn("Unauthorized wishlist add attempt");
            return errorResponse(res, 401, "User not logged in");
        }

        if (!product_id) {
            logger.warn("Missing product_id in addToWishlist");
            return errorResponse(res, 400, "Product ID is required");
        }

        const result = await addToWishlistService(userId, product_id);
        if (!result.status)
            return errorResponse(res, 400, result.message || "Failed to add to wishlist");

        logger.info(`Wishlist add successful for user ${userId}`);
        return successResponse(res, 200, "Product added to wishlist successfully", result.data);
    } catch (error) {
        logger.error(`addToWishlistController Error: ${error.message}`);
        return errorResponse(res, 500, "Internal Server Error");
    }
};

export const removeFromWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const userId = req?.session?.user?.userId;

        if (!userId) {
            logger.warn("Unauthorized wishlist remove attempt");
            return errorResponse(res, 401, "User not logged in");
        }

        const result = await removeFromWishlistService(userId, productId);
        if (!result.status)
            return errorResponse(res, 400, result.message || "Failed to remove product");

        logger.info(`Wishlist remove successful for user ${userId}`);
        return successResponse(res, 200, "Product removed from wishlist successfully");
    } catch (error) {
        logger.error(`removeFromWishlistController Error: ${error.message}`);
        return errorResponse(res, 500, "Internal Server Error");
    }
};

export const getWishlist = async (req, res, next) => {
    try {
        const userId = req?.session?.user?.userId;

        if (!userId) {
            logger.warn("Unauthorized wishlist fetch attempt");
            return errorResponse(res, 401, "User not logged in");
        }

        const result = await getAllWishlistService(userId);
        if (!result.status)
            return errorResponse(res, 400, result.message || "Failed to fetch wishlist");

        logger.info(`Wishlist fetched for user ${userId}`);
        return successResponse(res, 200, "Wishlist fetched successfully", result.data);
    } catch (error) {
        logger.error(`getWishlistController Error: ${error.message}`);
        return errorResponse(res, 500, "Internal Server Error");
    }
};