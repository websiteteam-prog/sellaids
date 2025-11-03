import axios from "axios";
import config from "../../config/config.js";
import { sendSMS } from "../../providers/sms/smsAlert.js";
import { Order } from "../../models/orderModel.js";
import { User } from "../../models/userModel.js";

const xpressbees = axios.create({
  baseURL: config.xpressbees.baseUrl,
  headers: { "Content-Type": "application/json" },
});

// Shipment Create (When order confirm)
export const createShipmentService = async (order) => {
  try {
    const response = await xpressbees.post("/api/franchise/shipments/create", {
      order_number: order.id,
      consignee_name: order.customer_name,
      consignee_address: order.shipping_address,
      consignee_pincode: order.pincode,
      consignee_phone: order.mobile,
      weight: order.total_weight || 0.5,
      product_value: order.total_amount,
    });

    const data = response.data;
    if (data.awb_number) {
      await order.update({ awb_number: data.awb_number });
      console.log(`✅ Shipment created for order ${order.id}: ${data.awb_number}`);
    }
    return data;
  } catch (error) {
    console.error("Xpressbees createShipment error:", error.response?.data || error.message);
    throw new Error("Shipment creation failed");
  }
};

// Shipment Tracking (for CRON/Webhook)
export const trackShipmentService = async (awbNumber) => {
  try {
    const response = await xpressbees.post("/api/franchise/shipments/track_shipment", {
      awb_number: awbNumber,
    });
    const trackingData = response.data;

    if (trackingData?.status) {
      const order = await Order.findOne({ where: { awb_number: awbNumber } });
      if (!order) return;

      // status change ke hisab se order update + SMS
      const newStatus = trackingData.status.toLowerCase();

      if (newStatus.includes("shipped") && order.order_status !== "shipped") {
        await order.update({ order_status: "shipped" });
        const user = await User.findOne({ where: { id: order.user_id } });
        await sendSMS(
          user.mobile,
          `Hi ${user.name}, your order ${order.id} has been shipped and is on its way! Thank you for shopping with Stylekins Pvt. Ltd.`
        );
      }

      if (newStatus.includes("delivered") && order.order_status !== "delivered") {
        await order.update({ order_status: "delivered" });
        const user = await User.findOne({ where: { id: order.user_id } });
        await sendSMS(
          user.mobile,
          `Hi ${user.name}, your order ${order.id} has been successfully delivered. We hope you love your purchase! Thank you for shopping with Stylekins Pvt. Ltd.`
        );
      }
    }

    return trackingData;
  } catch (error) {
    console.error("trackShipmentService error:", error.response?.data || error.message);
    throw new Error("Shipment tracking failed");
  }
};