import Razorpay from "razorpay"
import config from "../../config/config.js"

export const createRazorpayInstance = () => {
    return new Razorpay({
        key_id: config.payment.razorpayKeyId,
        key_secret: config.payment.razorpayKeySecret,
    })
}