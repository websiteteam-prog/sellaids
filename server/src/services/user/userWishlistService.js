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
      // If product already in wishlist, do nothing and return success
      logger.info(`Product ${productId} already in wishlist for user ${userId}`);
      return { status: true, data: existing, action: "already_present" };
    }

    const newItem = await Wishlist.create({
      user_id: userId,
      product_id: productId,
    });

    logger.info(`Product ${productId} successfully added to wishlist`);
    return { status: true, data: newItem, action: "added" };
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
          attributes: ['id', 'product_type', 'purchase_price', 'front_photo', 'back_photo', 'label_photo', 'inside_photo', 'button_photo', 'wearing_photo', 'more_images'],
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
          front_photo: item.Product.front_photo,
          back_photo: item.Product.back_photo,
          label_photo: item.Product.label_photo,
          inside_photo: item.Product.inside_photo,
          button_photo: item.Product.button_photo,
          wearing_photo: item.Product.wearing_photo,
          more_images: item.Product.more_images,
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