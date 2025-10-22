import logger from "../../config/logger.js";
import { Cart } from "../../models/cartModel.js";
import { User } from "../../models/userModel.js";
import { userAddressSchema } from "../../validations/addressValidation.js";

export const addAddressService = async (userId, addressData) => {
    const validatedData = await userAddressSchema.validate(addressData, { abortEarly: false });
    await User.update(validatedData, { where: { id: userId } });
    return validatedData;
};

export const getAddressService = async (userId) => {
    const user = await User.findOne({ where: { id: userId }, attributes: ["address_line", "city", "state", "pincode"] });
    if (!user) throw new Error("Address not found");
    return user;
};

export const updateAddressService = async (userId, addressData) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    const updatedData = {
        address_line: addressData.address_line ?? user.address_line,
        city: addressData.city ?? user.city,
        state: addressData.state ?? user.state,
        pincode: addressData.pincode ?? user.pincode,
    };

    await User.update(updatedData, { where: { id: userId } });
    return updatedData;
};

export const addToCartService = async (userId, productId) => {
  try {
    logger.info(`Adding product ${productId} to cart for user ${userId}`);

    // Check if the item already exists in the cart
    const existingCartItem = await Cart.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (existingCartItem) {
      // Update quantity if item exists
      existingCartItem.quantity += 1;
      await existingCartItem.save();
      logger.info(`Updated quantity for product ${productId} in cart`);
      return { status: true, data: existingCartItem };
    }

    // Add new item if it doesn't exist
    const newCartItem = await Cart.create({
      user_id: userId,
      product_id: productId,
    });

    logger.info(`Product ${productId} successfully added to cart`);
    return { status: true, data: newCartItem };
  } catch (error) {
    logger.error(`Error in addToCartService: ${error.message}`);
    throw new Error("Failed to add product to cart");
  }
};