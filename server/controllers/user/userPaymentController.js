import { createPaymentOrder, verifyPaymentSignature } from "../../services/paymentGateway.js"
import { successResponse } from "../../utils/apiResponse.js"

export const createPaymentController = (req, res, next) => {
    try {
        return successResponse(res, 201, "add watchlist successfully", result)
    } catch (err) {
        next(err)
    }
}

export const verifyPaymentController = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: 'Invalid payment data' });
        }

        const isValid = verifyPaymentSignature({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        if (!isValid) {
            return res.status(400).json({ error: 'Invalid payment signature' });
        }

        const order = await OrderRepository.findByRazorpayOrderId(razorpay_order_id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // 3. Update payment status and save paymentId
        // await OrderRepository.updatePayment(order.id, {
        //     paymentId: razorpay_payment_id,
        //     paymentStatus: 'paid',
        //     orderStatus: 'processing',
        // });
        return successResponse(res, 200, "Payment verified and order updated", result)
    } catch (err) {
        next(err)
    }
}