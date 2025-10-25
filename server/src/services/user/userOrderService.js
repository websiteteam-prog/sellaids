// services/orderService.js
import { sequelize } from "../../config/db.js";
import { Order } from "../../models/orderModel.js";
import { Cart } from "../../models/userCartModel.js"; // agar cart model same folder
import { Product } from "../../models/productModel.js";
import logger from "../../config/logger.js";


export const createOrderFromCartService = async (userId, shippingAddress, clearCart = true) => {
  const t = await sequelize.transaction();
  try {
    // fetch cart items with product prices
    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [{ model: Product, as: "product", attributes: ["id", "selling_price", "vendor_id"] }],
      transaction: t
    });

    if (!cartItems || cartItems.length === 0) {
      await t.rollback();
      return { success: false, message: "Cart is empty" };
    }

    // calculate total
    let totalAmount = 0;
    const orderItemsPayload = cartItems.map(ci => {
      const unitPrice = parseFloat(ci.product.selling_price);
      const qty = ci.quantity;
      const total_price = +(unitPrice * qty).toFixed(2);
      totalAmount += total_price;
      return {
        product_id: ci.product.id,
        quantity: qty,
        unit_price: unitPrice,
        total_price
      };
    });

    // create order
    const order = await Order.create({
      user_id: userId,
      total_amount: +totalAmount.toFixed(2),
      payment_status: "unpaid",
      status: "pending",
      shipping_address: shippingAddress,
      order_date: new Date()
    }, { transaction: t });

    // insert order items
    for (const oi of orderItemsPayload) {
      await OrderItem.create({
        order_id: order.id,
        product_id: oi.product_id,
        quantity: oi.quantity,
        unit_price: oi.unit_price,
        total_price: oi.total_price
      }, { transaction: t });
    }

    // clear cart if requested
    if (clearCart) {
      await Cart.destroy({ where: { user_id: userId }, transaction: t });
    }

    await t.commit();
    return { success: true, message: "Order created", data: order };
  } catch (error) {
    logger.error("createOrderFromCartService error:", error);
    await t.rollback();
    throw error;
  }
};


export const finalizeOrderPaymentService = async (orderId, provider, providerPaymentId, amount, meta = {}) => {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(orderId, { transaction: t });
    if (!order) {
      await t.rollback();
      return { success: false, message: "Order not found" };
    }

    // simple checks: amount match
    if (parseFloat(amount) !== parseFloat(order.total_amount)) {
      // you may still allow partial, but by default fail
      await t.rollback();
      return { success: false, message: "Payment amount mismatch" };
    }

    // update order
    order.payment_status = "paid";
    order.status = "confirmed";
    order.payment_provider = provider;
    order.payment_id = providerPaymentId;
    await order.save({ transaction: t });

    // optional: create Payment row if using Payment model
    // await Payment.create({ order_id: order.id, provider, provider_payment_id: providerPaymentId, amount, status: "success", meta }, { transaction: t });

    await t.commit();
    return { success: true, message: "Payment verified and order confirmed", data: order };
  } catch (error) {
    logger.error("finalizeOrderPaymentService error:", error);
    await t.rollback();
    throw error;
  }
};


// export const getOrdersForAdminService = async (filters = {}) => {
//   try {
//     const orders = await Order.findAll({
//       include: [
//         {
//           model: OrderItem,
//           as: "order_items",
//           include: [
//             {
//               model: Product,
//               as: "product",
//               attributes: ["id", "product_group", "selling_price", "vendor_id"],
//               include: [{ association: "vendor", attributes: ["id", "name"] }] // ensure Product.belongsTo(Vendor, { as: 'vendor' })
//             }
//           ]
//         },
//         { association: "user", attributes: ["id", "name", "email"] }
//       ],
//       order: [["order_date", "DESC"]]
//     });

//     return { success: true, data: orders };
//   } catch (error) {
//     throw error;
//   }
// };


// export const getUserPaymentSummaryService = async (userId) => {
//   try {
//     const orders = await Order.findAll({
//       where: { user_id: userId, payment_status: "paid" },
//       attributes: ["id", "total_amount", "payment_status"]
//     });

//     const totalSpent = orders.reduce((s, o) => s + parseFloat(o.total_amount), 0);
//     return { success: true, data: { totalSpent: +totalSpent.toFixed(2), ordersCount: orders.length } };
//   } catch (error) {
//     throw error;
//   }
// };

// export const getVendorEarningsSummaryService = async (vendorId) => {
//   try {
//     // fetch order_items joined with orders and products for this vendor
//     const items = await OrderItem.findAll({
//       include: [
//         {
//           model: Product,
//           as: "product",
//           where: { vendor_id: vendorId },
//           attributes: ["id", "vendor_id"]
//         },
//         {
//           model: Order,
//           as: "order",
//           attributes: ["id", "payment_status"]
//         }
//       ]
//     });

//     let earned = 0;
//     let pending = 0;
//     for (const it of items) {
//       const val = parseFloat(it.total_price);
//       if (it.order.payment_status === "paid") earned += val;
//       else pending += val;
//     }

//     return { success: true, data: { vendorId, earned: +earned.toFixed(2), pending: +pending.toFixed(2), itemsCount: items.length } };
//   } catch (error) {
//     throw error;
//   }
// };