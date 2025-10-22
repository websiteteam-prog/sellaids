import { Wishlist } from "../../models/userWishlistModel.js";
import logger from "../../config/logger.js";
import { Product } from "../../models/productModel.js";
import { User } from "../../models/userModel.js";

export const addToWishlistService = async (userId, productId) => {
    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            logger.warn(`Product ${productId} not found`);
            return { status: false, message: "Product not found" };
        }

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
    const items = await Wishlist.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          attributes: ['id', 'product_type', 'purchase_price'],
        },
        {
          model: User,
          attributes: ['id', 'name'], 
        },
      ],
    });

    logger.info(`Fetched ${items.length} items from wishlist`);
    return {
      status: true,
      data: items.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        product_id: item.product_id,
        created_at: item.created_at,
        product: item.Product ? {
          id: item.Product.id,
          name: item.Product.product_type,
          price: item.Product.purchase_price,
        } : null,
        user: item.User ? {
          id: item.User.id,
          name: item.User.name,
        } : null,
      })),
    };
  } catch (error) {
    logger.error(`Error in getAllWishlistService: ${error.message}`);
    throw new Error("Failed to fetch wishlist");
  }
};