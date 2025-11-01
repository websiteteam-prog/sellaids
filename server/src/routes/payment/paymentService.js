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
import { sendSMS } from "../../providers/sms/smsAlert.js"
import { createShipmentService } from "../xpressbees/xpressbeesService.js"

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

export const createOrderService = async (userId, cartItems, shippingAddress, finalTotalFromFrontend) => {
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

    const SHIPPING_FEE = 100;
    const PLATFORM_FEE = 50;
    const finalAmount = totalAmount + SHIPPING_FEE + PLATFORM_FEE;

    if (finalTotalFromFrontend && Math.abs(finalTotalFromFrontend - finalAmount) > 0.01) {
      logger.warn(`Frontend total mismatch: ${finalTotalFromFrontend} vs ${finalAmount}`);
    }

    const existingPayment = await Payment.findOne({
      where: { user_id: userId, payment_status: "pending" },
      include: [{ model: Order, as: "order" }],
      transaction,
    });

    let razorpayOrder, orders = [], payment;

    const razorpay = createRazorpayInstance();
    if (!razorpay) {
      await transaction.rollback();
      return { status: false, message: "Failed to initialize payment gateway" };
    }

    if (existingPayment) {
      logger.info(`Reusing existing pending payment for user ${userId}`);

      razorpayOrder = {
        id: existingPayment.razorpay_order_id,
        amount: finalAmount * 100,
        currency: existingPayment.currency || "INR",
      };

      const existingOrders = await Order.findAll({
        where: { user_id: userId, payment_status: "pending" },
        transaction,
      });

      if (existingOrders.length) {
        for (const order of existingOrders) {
          await order.update(
            {
              total_amount: totalAmount,
              shipping_address: shippingAddress,
              updated_at: new Date(),
            },
            { transaction }
          );
        }
        orders = existingOrders;
      }

      await existingPayment.update(
        {
          amount: finalAmount,
          shipping_fee: SHIPPING_FEE,
          platform_fee: PLATFORM_FEE,
          vendor_earning: totalAmount * 0.8,
          updated_at: new Date(),
        },
        { transaction }
      );

      payment = existingPayment;
    } else {
      razorpayOrder = await razorpay.orders.create({
        amount: finalAmount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}_${userId}`,
      });

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

      payment = await Payment.create(
        {
          order_id: orders[0].id,
          user_id: userId,
          vendor_id: vendorId,
          payment_method: "razorpay",
          razorpay_order_id: razorpayOrder.id,
          amount: finalAmount,
          shipping_fee: SHIPPING_FEE,
          platform_fee: PLATFORM_FEE,
          vendor_earning: totalAmount * 0.8,
          payment_status: "pending",
          payment_date: new Date(),
          payment_info: razorpayOrder,
          currency: razorpayOrder.currency,
        },
        { transaction }
      );
    }

    await transaction.commit();

    logger.info(
      existingPayment
        ? `Reused pending payment ${payment.razorpay_order_id} for user ${userId}`
        : `Created new Razorpay order ${razorpayOrder.id} for user ${userId}`
    );

    return {
      status: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount / 100,   // ← **IN RUPEES**
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
  const updatedOrders = [];
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
      updatedOrders.push(order); // updatedOrders push
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

    // fetch user details like name, mobile
    // const user = await User.findOne({
    //   where: { id: userId },
    //   attributes: ["name", "mobile"],
    // });

    // 🔹 Step 8: Send SMS and Create Shipment
    // if (user) {
    //   for (const order of updatedOrders) {
    //     try {
    //       // SMS #1 — Order Placed
    //       await sendSMS(
    //         user.mobile,
    //         `Hi ${user.name}, your order ${order.id} has been placed successfully. Thank you for shopping with Stylekins Pvt. Ltd.!`
    //       );
    //       logger.info(`SMS sent successfully to ${user.mobile} for order ${order.id}`);

    //       // Create Shipment in Xpressbees
    //       try {
    //         await createShipmentService(order);
    //         logger.info(`Xpressbees shipment created for order ${order.id}`);
    //       } catch (xbError) {
    //         logger.error(`Failed to create Xpressbees shipment for order ${order.id}:`, xbError);
    //       }
    //     } catch (smsError) {
    //       logger.error(`Failed to send SMS to ${user.mobile} for order ${order.id}:`, smsError);
    //     }
    //   }
    // }

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