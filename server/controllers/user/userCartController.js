import connectToDb from "../../config/db.js";
import { successResponse } from "../../utils/apiResponse.js"

export const addCartUserController = async (req, res, next) => {
    try {
        // fetch user and product id from frontend
        const { userId } = req.session
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "login required"
            })
        }
        const { productId } = req.body

        // product id required
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "product id is required"
            })
        }

        // add item to cart
        const [result] = await connectToDb.promise().query("INSERT INTO carts (user_id, product_id) VALUES(?, ?)", [userId, productId])
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            })
        }
        return successResponse(res, 201, "Add item to cart successfully", result)
    } catch (error) {
        next(error)
    }
}

export const getAllCartUserController = async (req, res, next) => {
    try {
        // fetch user id from frontend
        const { userId } = req.session
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "login required"
            })
        }

        // fetch all carts
        const [rows] = await connectToDb.promise().query("SELECT c.id, p.front_photo, c.quantity, p.purchase_price, p.selling_price, (c.quantity * p.selling_price) AS total_price FROM carts c JOIN products p ON p.id = c.product_id WHERE c.user_id = ?", [userId])
        if (rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "cart is empty"
            })
        }
        let grandTotal = rows.reduce((acc, item) => acc + parseFloat(item.total_price), 0)
        return successResponse(res, 200, "Cart items fetched successfully", rows, {grandTotal})
    } catch (error) {
        next(error)
    }
}

export const getCartUserController = async (req, res, next) => {
    try {
        // fetch user id from frontend
        const { userId } = req.session
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "login required"
            })
        }

        const { cartId } = req.params
        // cart id required
        if (!cartId) {
            return res.status(400).json({
                success: false,
                message: "cart id is required"
            })
        }

        // fetch cart details
        const [rows] = await connectToDb.promise().query("SELECT * FROM carts c JOIN products p ON c.product_id = p.id WHERE c.user_id = ? AND c.id = ?", [userId, cartId])
        if (rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "cart is empty"
            })
        }

        return successResponse(res, 200, "Cart items fetched successfully", rows[0])
    } catch (error) {
        next(error)
    }
}

export const updateCartQuantityController = async (req, res, next) => {
    try {
        const { userId } = req.session;
        if (!userId) {
            return res.status(400).json({ success: false, message: "login required" });
        }

        const { cartId } = req.params;
        const { action } = req.body;

        if (!cartId || !action) {
            return res.status(400).json({ success: false, message: "cartId and action required" });
        }

        // fetch current quantity
        const [rows] = await connectToDb.promise().query(
            "SELECT quantity FROM carts WHERE id = ? AND user_id = ?",
            [cartId, userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }

        let quantity = rows[0].quantity;

        // update quantity
        if (action === "increase") quantity += 1;
        else if (action === "decrease" && quantity > 1) quantity -= 1;
        else if (action === "decrease" && quantity === 1)
            return res.status(400).json({ success: false, message: "Quantity cannot be less than 1" });

        // save updated quantity
        const [result] = await connectToDb.promise().query(
            "UPDATE carts SET quantity = ? WHERE id = ? AND user_id = ?",
            [quantity, cartId, userId]
        );

        return successResponse(res, 200, "Cart quantity updated successfully", result)
    } catch (error) {
        next(error);
    }
};

export const removeCartUserController = async (req, res, next) => {
    try {
        // fetch user id from frontend
        const { userId } = req.session
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "login required"
            })
        }
        const { cartId } = req.params

        // cart id required
        if (!cartId) {
            return res.status(400).json({
                success: false,
                message: "cart id is required"
            })
        }

        // remove item from cart
        const [result] = await connectToDb.promise().query("DELETE FROM carts WHERE user_id = ? AND id = ?", [userId, cartId])
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            })
        }

        return successResponse(res, 200, "Item removed from cart successfully", result[0])
    } catch (error) {
        next(error)
    }
}