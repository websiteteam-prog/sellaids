import Razorpay from "razorpay"
import crypto from "crypto"
import dotenv from "dotenv"

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export const createPaymentOrder = async (amount, currency = "INR", receipt = "txn_receipt") => {
    const options = {
        amount: amount * 100, // convert ₹ to paise
        currency,
        receipt,
        payment_capture: 1
    }
    return await instance.orders.create(options)
}

export const verifyPaymentSignature = async ({ order_id, payment_id, signature }) => {
    const body = `${order_id}|${payment_id}`;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    return expectedSignature === signature;
}