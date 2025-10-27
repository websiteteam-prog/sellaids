import Razorpay from "razorpay";
import crypto from "crypto";
import { Order } from "../../models/orderModel.js";
import { Payment } from "../../models/paymentModel.js";
import { Cart } from "../../models/cartModel.js";
import { Product } from "../../models/productModel.js";
import { User } from "../../models/userModel.js";
import logger from "../../config/logger.js";
import { sequelize } from "../../config/db.js";
import { Vendor } from "../../models/vendorModel.js";

export const createRazorpayInstance = () => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    logger.info("Razorpay instance created successfully");
    return instance;
  } catch (error) {
    logger.error("Failed to create Razorpay instance:", error);
    return null;
  }
};

export const createOrderService = async (userId, cartItems, shippingAddress) => {
  const transaction = await sequelize.transaction();
  try {
    if (!cartItems?.length) {
      await transaction.rollback();
      return { status: false, message: "Cart is empty" };
    }

    let totalAmount = 0;
    for (const item of cartItems) {
      const product = await Product.findByPk(item.product_id, {
        transaction,
        include: [{ model: Vendor, as: "vendor" }],
      });
      if (!product) {
        await transaction.rollback();
        return { status: false, message: `Product ${item.product_id} not found` };
      }
      if (product.stock < item.quantity) {
        await transaction.rollback();
        return { status: false, message: `Product ${item.product_id} is out of stock` };
      }
      if (!product.vendor_id || !product.vendor) {
        await transaction.rollback();
        return { status: false, message: `Product ${item.product_id} has no associated vendor` };
      }
      totalAmount += product.purchase_price * item.quantity;
    }

    const razorpay = createRazorpayInstance();
    if (!razorpay) {
      await transaction.rollback();
      return { status: false, message: "Failed to initialize payment gateway" };
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}_${userId}`,
    });

    const orders = [];
    for (const item of cartItems) {
      const product = await Product.findByPk(item.product_id, { transaction });
      const order = await Order.create(
        {
          user_id: userId,
          vendor_id: product.vendor_id,
          product_id: item.product_id,
          quantity: item.quantity,
          total_amount: product.purchase_price * item.quantity,
          payment_status: "pending",
          order_status: "pending",
          shipping_address: shippingAddress,
          payment_method: "razorpay",
          transaction_id: razorpayOrder.id,
          order_date: new Date(),
        },
        { transaction }
      );
      await product.update({ stock: product.stock - item.quantity }, { transaction });
      orders.push(order);
    }

    const vendorId = orders[0].vendor_id;
    const vendorExists = await Vendor.findByPk(vendorId, { transaction });
    if (!vendorExists) {
      await transaction.rollback();
      return { status: false, message: `Vendor ${vendorId} not found` };
    }

    const payment = await Payment.create(
      {
        order_id: orders[0].id,
        user_id: userId,
        vendor_id: vendorId,
        payment_method: "razorpay",
        razorpay_order_id: razorpayOrder.id,
        amount: totalAmount,
        vendor_earning: totalAmount * 0.8,
        platform_fee: totalAmount * 0.2,
        payment_status: "pending",
        payment_date: new Date(),
        payment_info: razorpayOrder,
        currency: razorpayOrder.currency,
      },
      { transaction }
    );

    await transaction.commit();
    logger.info(`Razorpay order created: ${razorpayOrder.id} for user ${userId}`);

    return {
      status: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
        orderIds: orders.map((o) => o.id),
      },
    };
  } catch (error) {
    await transaction.rollback();
    logger.error(`createOrderService error for user ${userId}:`, error);
    return { status: false, message: error.message };
  }
};

export const verifyPaymentService = async (userId, paymentDetails) => {
  const transaction = await sequelize.transaction();
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderIds } = paymentDetails;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      await transaction.rollback();
      return { status: false, message: "Missing Razorpay payment details" };
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      await transaction.rollback();
      return { status: false, message: "Invalid payment signature" };
    }

    for (const orderId of orderIds) {
      const order = await Order.findOne({ where: { id: orderId, user_id: userId }, transaction });
      if (!order) {
        await transaction.rollback();
        return { status: false, message: `Order ${orderId} not found` };
      }
      await order.update(
        {
          payment_status: "success",
          order_status: "confirmed",
          transaction_id: razorpay_payment_id,
          updated_at: new Date(),
        },
        { transaction }
      );
    }

    const payment = await Payment.findOne({ where: { razorpay_order_id }, transaction });
    if (!payment) {
      await transaction.rollback();
      return { status: false, message: "Payment record not found" };
    }
    await payment.update(
      {
        payment_status: "success", // Corrected from 'status'
        razorpay_payment_id,
        razorpay_signature,
        transaction_id: razorpay_payment_id,
        payment_info: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
        updated_at: new Date(),
      },
      { transaction }
    );

    await Cart.destroy({ where: { user_id: userId }, transaction });

    await transaction.commit();
    logger.info(`Payment verified for Razorpay order ${razorpay_order_id}`);

    return { status: true, data: { orderIds, razorpay_order_id, razorpay_payment_id } };
  } catch (error) {
    await transaction.rollback();
    logger.error(`verifyPaymentService error for user ${userId}:`, error);
    return { status: false, message: error.message };
  }
};

export const cancelPaymentService = async (userId, razorpayOrderId, orderIds) => {
  const transaction = await sequelize.transaction();
  try {
    // Validate orders
    for (const orderId of orderIds) {
      const order = await Order.findOne({
        where: { id: orderId, user_id: userId, payment_status: "pending" }, // Added status check
        transaction,
      });
      if (!order) {
        await transaction.rollback();
        return { status: false, message: `Order ${orderId} not found or not cancellable` };
      }
      await order.update(
        {
          payment_status: "failed",
          order_status: "cancelled",
          updated_at: new Date(),
        },
        { transaction }
      );
    }

    // Update payment status
    const payment = await Payment.findOne({
      where: { razorpay_order_id: razorpayOrderId, payment_status: "pending" }, // Added status check
      transaction,
    });
    if (!payment) {
      await transaction.rollback();
      return { status: false, message: "Payment record not found or not cancellable" };
    }
    await payment.update(
      {
        payment_status: "failed", // Corrected from 'status'
        failure_reason: "Payment cancelled by user",
        updated_at: new Date(),
      },
      { transaction }
    );

    // Restore product stock
    for (const orderId of orderIds) {
      const order = await Order.findByPk(orderId, { transaction });
      const product = await Product.findByPk(order.product_id, { transaction });
      await product.update(
        { stock: product.stock + order.quantity },
        { transaction }
      );
    }

    await transaction.commit();
    logger.info(`Payment cancelled for Razorpay order ${razorpayOrderId}`);
    return { status: true, message: "Payment and order cancelled successfully" };
  } catch (error) {
    await transaction.rollback();
    logger.error(`cancelPaymentService error for user ${userId}:`, error);
    return { status: false, message: error.message };
  }
};