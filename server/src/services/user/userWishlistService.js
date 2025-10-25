import { Wishlist } from "../../models/userWishlistModel.js";
import { Product } from "../../models/productModel.js";
import logger from "../../config/logger.js";

export const addToWishlistService = async (userId, productId) => {
    try {
        const exists = await Wishlist.findOne({ where: { user_id: userId, product_id: productId } });
        if (exists) {
            return { success: false, message: "Product already in wishlist" };
        }

        const newItem = await Wishlist.create({ user_id: userId, product_id: productId });
        logger.info(`Wishlist added: user ${userId}, product ${productId}`);
        return { success: true, data: newItem };
    } catch (error) {
        logger.error("Error in addToWishlistService:", error);
        throw error;
    }
};

export const removeFromWishlistService = async (userId, productId) => {
    try {
        const deleted = await Wishlist.destroy({ where: { user_id: userId, product_id: productId } });
        if (!deleted) {
            return { success: false, message: "Product not found in wishlist" };
        }

        logger.info(`Wishlist removed: user ${userId}, product ${productId}`);
        return { success: true };
    } catch (error) {
        logger.error("Error in removeFromWishlistService:", error);
        throw error;
    }
};

export const getAllWishlistService = async (userId) => {
    try {
        const items = await Wishlist.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Product,
                    as: "product",
                    attributes: [
                        "id",
                        "product_group",
                        "brand",
                        "model_name",
                        "front_photo",
                        "selling_price",
                        "status",
                        "size",
                        "fit",
                        "product_color"
                    ],
                },
            ],
            order: [["created_at", "DESC"]],
        });

        logger.info(`Fetched ${items?.length} wishlist items for user ${userId}`);
        return { success: true, data: items.map(item => item.product) };
    } catch (error) {
        logger.error("Error in getAllWishlistService:", error);
        throw error;
    }
};