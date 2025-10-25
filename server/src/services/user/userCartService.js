import { Cart } from "../../models/userCartModel.js";
import { Product } from "../../models/productModel.js";
import logger from "../../config/logger.js"

// Add to cart (duplicate check)
export const addToCartService = async (userId, productId) => {
  try {
    const existing = await Cart.findOne({ where: { user_id: userId, product_id: productId } });

    if (existing) {
      // Only log when duplicate add is attempted
      logger.warn(`Duplicate add to cart attempt → userId: ${userId}, productId: ${productId}`);
      return {
        success: false,
        message: "Product already in cart. Please update quantity from cart.",
        data: existing,
      };
    }

    const cartItem = await Cart.create({
      user_id: userId,
      product_id: productId,
      quantity: 1,
    });

    return {
      success: true,
      message: "Product added to cart",
      data: cartItem,
    };
  } catch (error) {
    // Only log when error occurs
    logger.error(`Cart add failed → userId: ${userId}, productId: ${productId}, error: ${error.message}`);
    throw error;
  }
};
// export const addToCartService = async (userId, productId) => {
//   try {
//     const existing = await Cart.findOne({ where: { user_id: userId, product_id: productId } });

//     if (existing) {
//       existing.quantity += 1;
//       await existing.save();
//       return { success: true, message: "Quantity updated", data: existing };
//     }

//     const cartItem = await Cart.create({ user_id: userId, product_id: productId, quantity: 1 });
//     return { success: true, message: "Product added to cart", data: cartItem };
//   } catch (error) {
//     throw error;
//   }
// };

// Update quantity (increase/decrease)
export const updateCartQuantityService = async (userId, cartId, action) => {
  try {
    const cartItem = await Cart.findOne({ where: { id: cartId, user_id: userId } });

    if (!cartItem) {
      return { success: false, message: "Cart item not found" };
    }

    if (action === "increase") {
      cartItem.quantity += 1;
    } else if (action === "decrease") {
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
      } else {
        return { success: false, message: "Quantity cannot be less than 1" };
      }
    } else {
      return { success: false, message: "Invalid action. Use 'increase' or 'decrease'" };
    }

    await cartItem.save();

    return { success: true, message: "Cart quantity updated", data: cartItem };
  } catch (error) {
    throw error;
  }
};

// Remove cart item
export const removeCartService = async (userId, cartId) => {
  try {
    const deleted = await Cart.destroy({ where: { id: cartId, user_id: userId } });
    if (!deleted) return { success: false, message: "Cart item not found" };
    return { success: true, message: "Cart item removed" };
  } catch (error) {
    throw error;
  }
};

// Get all cart items with product info and total price
export const getCartItemsService = async (userId) => {
  try {
    const items = await Cart.findAll({
      where: { user_id: userId },
      include: [{ model: Product, as: "product", attributes: ["id", "product_group", "selling_price", "front_photo"] }],
    });

    const grandTotal = items.reduce((sum, item) => sum + item.quantity * parseFloat(item.product.selling_price), 0);

    return { success: true, data: { items, grandTotal } };
  } catch (error) {
    throw error;
  }
};

// Get single cart item
export const getCartItemService = async (userId, cartId) => {
  try {
    const cartItem = await Cart.findOne({
      where: { id: cartId, user_id: userId },
      include: [{ model: Product, as: "product", attributes: ["id", "product_group", "selling_price", "front_photo"] }],
    });

    if (!cartItem) return { success: false, message: "Cart item not found" };
    return { success: true, data: cartItem };
  } catch (error) {
    throw error;
  }
};

// Add or increase quantity
// export const addToCartService = async (userId, productId, quantity = 1) => {
//   try {
//     const existing = await Cart.findOne({ where: { user_id: userId, product_id: productId } });

//     if (existing) {
//       existing.quantity += quantity;  // Increment quantity
//       await existing.save();
//       return { success: true, data: existing, message: "Quantity updated" };
//     }

//     const cartItem = await Cart.create({ user_id: userId, product_id: productId, quantity });
//     return { success: true, data: cartItem, message: "Product added to cart" };
//   } catch (error) {
//     throw error;
//   }
// };

// // Decrease quantity
// export const decreaseCartQuantityService = async (userId, productId, quantity = 1) => {
//   try {
//     const existing = await Cart.findOne({ where: { user_id: userId, product_id: productId } });

//     if (!existing) return { success: false, message: "Product not found in cart" };

//     if (existing.quantity <= quantity) {
//       await existing.destroy(); // Remove product if quantity becomes 0 or less
//       return { success: true, message: "Product removed from cart" };
//     }

//     existing.quantity -= quantity;  // Decrease quantity
//     await existing.save();
//     return { success: true, data: existing, message: "Quantity decreased" };
//   } catch (error) {
//     throw error;
//   }
// };

// // Remove product completely
// export const removeFromCartService = async (userId, productId) => {
//   try {
//     const deleted = await Cart.destroy({ where: { user_id: userId, product_id: productId } });
//     if (!deleted) return { success: false, message: "Product not found in cart" };
//     return { success: true };
//   } catch (error) {
//     throw error;
//   }
// };

// // Get all cart items with product details and total price
// export const getCartItemsService = async (userId) => {
//   try {
//     const items = await Cart.findAll({
//       where: { user_id: userId },
//       include: [
//         {
//           model: Product,
//           as: "product",
//           attributes: ["id", "product_group", "product_type", "selling_price", "front_photo"],
//         },
//       ],
//     });

//     const totalPrice = items.reduce((sum, item) => {
//       return sum + item.quantity * parseFloat(item.product.selling_price);
//     }, 0);

//     return { success: true, data: { items, totalPrice } };
//   } catch (error) {
//     throw error;
//   }
// };