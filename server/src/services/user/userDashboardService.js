import { Order } from "../../models/orderModel.js";
import { Wishlist } from "../../models/userWishlistModel.js";
import { UserSupport } from "../../models/userSupportModel.js";

export const getDashboardStatsService = async (userId) => {
  try {
    const totalOrders = await Order.count({
      where: { user_id: userId },
    });

    const pendingOrders = await Order.count({
      where: { user_id: userId, order_status: "pending" },
    });

    const wishlistItems = await Wishlist.count({
      where: { user_id: userId },
    });

    const supportTickets = await UserSupport.count({
      where: { user_id: userId },
    });

    return {
      total_orders: totalOrders,
      pending_orders: pendingOrders,
      wishlist_items: wishlistItems,
      support_tickets: supportTickets,
    };
  } catch (error) {
    throw new Error("Error fetching dashboard KPIs: " + error.message);
  }
};