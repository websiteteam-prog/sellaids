import { Wishlist } from "../../models/wishlistModel.js";
import logger from "../../config/logger.js";

export const addToWishlistService = async (userId, productId) => {
    try {
        logger.info(`Adding product ${productId} to wishlist for user ${userId}`);

        const existing = await Wishlist.findOne({
            where: { user_id: userId, product_id: productId },
        });

        if (existing) {
            logger.warn(`Product ${productId} already in wishlist for user ${userId}`);
            return { status: false, message: "Product already in wishlist" };
        }

        const newItem = await Wishlist.create({
            user_id: userId,
            product_id: productId,
        });

        logger.info(`Product ${productId} successfully added to wishlist`);
        return { status: true, data: newItem };
    } catch (error) {
        logger.error(`Error in addToWishlistService: ${error.message}`);
        throw new Error("Failed to add product to wishlist");
    }
};

export const removeFromWishlistService = async (userId, productId) => {
    try {
        logger.info(`Removing product ${productId} from wishlist for user ${userId}`);

        const deleted = await Wishlist.destroy({
            where: { user_id: userId, product_id: productId },
        });

        if (!deleted) {
            logger.warn(`Product ${productId} not found in wishlist of user ${userId}`);
            return { status: false, message: "Product not found in wishlist" };
        }

        logger.info(`Product ${productId} removed successfully from wishlist`);
        return { status: true };
    } catch (error) {
        logger.error(`Error in removeFromWishlistService: ${error.message}`);
        throw new Error("Failed to remove product from wishlist");
    }
};

export const getAllWishlistService = async (userId) => {
    try {
        logger.info(`Fetching wishlist for user ${userId}`);
        const items = await Wishlist.findAll({ where: { user_id: userId } });

        logger.info(`Fetched ${items.length} items from wishlist`);
        return { status: true, data: items };
    } catch (error) {
        logger.error(`Error in getAllWishlistService: ${error.message}`);
        throw new Error("Failed to fetch wishlist");
    }
};