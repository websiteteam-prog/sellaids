import { createOrderService, verifyPaymentService } from "../payment/paymentService.js";
import logger from "../../config/logger.js";
import { Order } from "../../models/orderModel.js";
import { Payment } from "../../models/paymentModel.js";

export const createOrderController = async (req, res) => {
  const userId = req.session?.user?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "User not logged in or session expired" });
  }

  const { cartItems, shippingAddress } = req.body;

  try {
    const result = await createOrderService(userId, cartItems, shippingAddress);

    if (!result.status) {
      return res.status(400).json({ success: false, message: result.message });
    }

    logger.info(`Order created for user ${userId}`);
    return res.status(200).json({ success: true, message: "Order created", data: result.data });
  } catch (error) {
    logger.error(`createOrderController error for user ${userId}:`, error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const verifyPaymentController = async (req, res) => {
  const userId = req.session?.user?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "User not logged in or session expired" });
  }

  const paymentDetails = req.body;

  try {
    const result = await verifyPaymentService(userId, paymentDetails);

    if (!result.status) {
      return res.status(400).json({ success: false, message: result.message });
    }

    logger.info(`Payment verified for user ${userId}`);
    return res.status(200).json({ success: true, message: "Payment verified successfully", data: result.data });
  } catch (error) {
    logger.error(`verifyPaymentController error for user ${userId}:`, error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const getLatestOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const latestOrder = await Order.findOne({
      where: { user_id: userId, payment_status: "unpaid" },
      order: [["created_at", "DESC"]],
      include: [{ model: Payment, where: { status: "pending" } }],
    });
    if (!latestOrder) {
      return res.status(404).json({ success: false, message: "No pending order found" });
    }
    const payment = latestOrder.Payment;
    return res.status(200).json({
      success: true,
      data: {
        razorpayOrderId: payment.razorpay_order_id,
        amount: payment.amount * 100, // Convert to paise
        currency: payment.currency,
        key: process.env.RAZORPAY_KEY_ID,
        orderIds: [latestOrder.id],
      },
    });
  } catch (error) {
    logger.error(`getLatestOrder error for user ${req.params.userId}:`, error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};