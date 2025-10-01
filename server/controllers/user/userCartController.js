import connectToDb from "../../config/db";

export const addCartUserController = async (req, res) => {
    try {
        // fetch user and product id from frontend
        const { user_id } = req.params
        const { product_id } = req.params

        // user and product id required
        if (!user_id || !product_id) {
            return res.status(400).json({
                success: false,
                message: !user_id ? "user id is required" : "product id is required"
            })
        }

        // fetch details from product
        const [rows] = await connectToDb.promise().query("SELECT * FROM products WHERE product_id = ?", [product_id])
        const product = rows[0]
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "product not found"
            })
        }

        // check if add item cart exists or not 
        await connectToDb.promise().query("")

        // add item to cart
        const [result] = await connectToDb.promise().query("INSERT INTO cart WHERE user_id = ? AND product_id = ?", [user_id, product_id])
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            })
        }
        return res.status(201).json({
            success: true,
            message: "Add item to cart successfully",
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed add item to cart",
            error: error.message
        })
    }
}

export const getCartUserController = async (req, res) => {
    try {
        // fetch user id from frontend
        const { user_id } = req.params;

        // user id required
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "user id is required"
            })
        }

        // delete product
        const [result] = await connectToDb.promise().query("DELETE FROM products WHERE id = ?", [id])
        const [cartitems] = await connectToDb.promise().query("SELECT * FROM cart WHERE user_id = ?", [user_id])
        return res.status(200).json({
            success: true,
            message: "Cart items fetched successfully",
            data: cartitems
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch cart items",
            error: error.message
        })
    }
}

export const removeCartUserController = async (req, res) => {
    try {
        // fetch user and product id from frontend
        const { user_id } = req.params
        const { product_id } = req.params

        // user and product id required
        if (!user_id || !product_id) {
            return res.status(400).json({
                success: false,
                message: !user_id ? "user id is required" : "product id is required"
            })
        }

        // remove item from cart
        const [result] = await connectToDb.promise().query("DELETE FROM cart WHERE user_id = ? AND product_id = ?", [user_id, product_id])
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: "Item removed from cart successfully",
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to remove item from cart",
            error: error.message
        })
    }
}