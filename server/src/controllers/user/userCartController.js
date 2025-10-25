import { addToCartService, updateCartQuantityService, removeCartService, getCartItemsService, getCartItemService } from "../../services/user/userCartService.js"
import { successResponse, errorResponse } from "../../utils/helpers.js"
import logger from "../../config/logger.js"

// Add to cart
export const addCartController = async (req, res) => {
    try {
      const userId = req.session?.user?.userId;
      const { productId } = req.body;
  
      if (!userId || !productId) {
        // Only log bad requests
        logger.warn("Missing userId or productId in cart add request");
        return errorResponse(res, 400, "User and Product required");
      }
  
      const result = await addToCartService(userId, productId);
  
      if (!result.success) {
        return errorResponse(res, 400, result.message);
      }
  
      return successResponse(res, 201, result.message, result.data);
    } catch (error) {
      // Log actual caught error
      logger.error("Add Cart Error:", error);
      return errorResponse(res, 500, error);
    }
  };
// export const addCartController = async (req, res) => {
//     try {
//         const userId = req.session?.user?.userId;
//         const { productId } = req.body;
//         if (!userId || !productId) return errorResponse(res, 400, "User and Product required");

//         const result = await addToCartService(userId, productId);
//         return successResponse(res, 201, result.message, result.data);
//     } catch (error) {
//         logger.error("Add Cart Error:", error);
//         return errorResponse(res, 500, error.message);
//     }
// };

// Update quantity
export const updateCartQuantityController = async (req, res) => {
    try {
        const userId = req.session?.user?.userId;
        const { cartId } = req.params;
        const { action } = req.body;

        if (!userId || !cartId || !action) {
            return errorResponse(res, 400, "User ID, Cart ID, and action are required");
        }

        const result = await updateCartQuantityService(userId, cartId, action);

        if (!result.success) {
            return errorResponse(res, 400, result.message);
        }

        return successResponse(res, 200, result.message, result.data);
    } catch (error) {
        logger.error("Update Cart Quantity Error:", error);
        return errorResponse(res, 500, error);
    }
};

// Remove cart item
export const removeCartController = async (req, res) => {
    try {
        const userId = req.session?.user?.userId;
        const { cartId } = req.params;
        if (!userId || !cartId) return errorResponse(res, 400, "User and CartId required");

        const result = await removeCartService(userId, cartId);
        if (!result.success) return errorResponse(res, 404, result.message);

        return successResponse(res, 200, result.message);
    } catch (error) {
        logger.error("Remove Cart Error:", error);
        return errorResponse(res, 500, error);
    }
};

// Get all cart items
export const getCartController = async (req, res) => {
    try {
        const userId = req.session?.user?.userId;
        if (!userId) return errorResponse(res, 401, "Login required");

        const result = await getCartItemsService(userId);
        return successResponse(res, 200, "Cart fetched successfully", result.data);
    } catch (error) {
        logger.error("Get Cart Error:", error);
        return errorResponse(res, 500, error);
    }
};

// Get single cart item
export const getCartItemController = async (req, res) => {
    try {
        const userId = req.session?.user?.userId;
        const { cartId } = req.params;
        if (!userId || !cartId) return errorResponse(res, 400, "User and CartId required");

        const result = await getCartItemService(userId, cartId);
        if (!result.success) return errorResponse(res, 404, result.message);

        return successResponse(res, 200, "Cart item fetched", result.data);
    } catch (error) {
        logger.error("Get Single Cart Item Error:", error);
        return errorResponse(res, 500, error);
    }
};

// // Add or increase
// export const addCartController = async (req, res) => {
//     try {
//         const userId = req.session?.user?.userId;
//         const { product_id, quantity } = req.body;

//         if (!userId || !product_id) return errorResponse(res, 400, "User ID and Product ID required");

//         const result = await addToCartService(userId, product_id, quantity);
//         return successResponse(res, 201, result.message, result.data);
//     } catch (error) {
//         logger.error("addCart Controller Error:", error);
//         return errorResponse(res, 500, error.message);
//     }
// };

// // Decrease quantity
// export const decreaseCartController = async (req, res) => {
//     try {
//         const userId = req.session?.user?.userId;
//         const { product_id, quantity } = req.body;

//         if (!userId || !product_id) return errorResponse(res, 400, "User ID and Product ID required");

//         const result = await decreaseCartQuantityService(userId, product_id, quantity);
//         if (!result.success) return errorResponse(res, 404, result.message);

//         return successResponse(res, 200, result.message, result.data);
//     } catch (error) {
//         logger.error("decreaseCart Controller Error:", error);
//         return errorResponse(res, 500, error.message);
//     }
// };

// // Remove completely
// export const removeCartController = async (req, res) => {
//     try {
//         const userId = req.session?.user?.userId;
//         const { productId } = req.params;

//         if (!userId || !productId) return errorResponse(res, 400, "User ID and Product ID required");

//         const result = await removeFromCartService(userId, productId);
//         if (!result.success) return errorResponse(res, 404, result.message);

//         return successResponse(res, 200, "Product removed from cart");
//     } catch (error) {
//         logger.error("removeCart Controller Error:", error);
//         return errorResponse(res, 500, error.message);
//     }
// };

// // Get all cart items
// export const getCartController = async (req, res) => {
//     try {
//         const userId = req.session?.user?.userId;
//         if (!userId) return errorResponse(res, 401, "User not logged in");

//         const result = await getCartItemsService(userId);
//         return successResponse(res, 200, "Cart items fetched successfully", result.data);
//     } catch (error) {
//         logger.error("getCart Controller Error:", error);
//         return errorResponse(res, 500, error.message);
//     }
// };