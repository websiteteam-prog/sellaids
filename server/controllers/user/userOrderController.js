import crypto from "crypto"
import connectToDb from "../../config/db.js"
import { createRazorpayInstance } from "../../services/paymentGateway.js"
import { successResponse } from "../../utils/apiResponse.js"

export const createOrderController = async (req, res, next) => {
    const instance = createRazorpayInstance()
    try {
        const { userId } = req.session
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "login required"
            })
        }

        const [cartItems] = await connectToDb.promise().query(`SELECT c.id as cart_id, c.quantity, p.id as product_id, p.selling_price  FROM carts c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?`, [userId])
        if (cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "cart is empty"
            })
        }

        // Calculate total amount
        const totalAmount = cartItems.reduce((sum, item) => sum + item.selling_price * item.quantity, 0);

        // create razorpay order
        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        }


        const order = await instance.orders.create(options)
        return successResponse(res, 201, "Order place successfully", order)
    } catch (error) {
        next(error)
    }
}

export const verifyPaymentSignatureController = async (req, res, next) => {
    try {
        const { userId } = req.session
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "user id not found"
            })
        }

        const { orderId, paymentId, signature } = req.body
        if (!orderId || !paymentId || !signature) {
            return res.status(400).json({
                success: false,
                message: "Missing payment details",
            });
        }

        // Generate expected signature
        const sign = orderId + "|" + paymentId;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest("hex")
        console.log(expectedSignature)
        // Compare signatures
        if (signature !== expectedSignature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed!",
            });
        }

        // ✅ Signature verified — save order in DB
        const [result] = await connectToDb.promise().query(
            `INSERT INTO orders (user_id, payment_id, payment_status)
            VALUES (?, ?, ?, ?)`,
            [userId, orderId, paymentId, "PAID"]
        );

        // ✅ Clear cart after successful payment
        await connectToDb.promise().query(`DELETE FROM carts WHERE user_id = ?`, [userId]);
        return successResponse(res, 200, "Payment verified and order placed successfully", result)
    } catch (error) {
        next(error)
    }
}

export const getAllOrderController = async (req, res, next) => {
    try {
        const { userId } = req.session
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "user id not found"
            })
        }

        const [rows] = await connectToDb.promise().query(`SELECT * FROM orders WHERE user_id = ?`, [userId]);
        if (rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "orders not found"
            })
        }
        return successResponse(res, 201, "fetch all order successfully", rows)
    } catch (error) {
        next(error)
    }
}