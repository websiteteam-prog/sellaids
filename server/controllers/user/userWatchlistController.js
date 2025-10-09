import connectToDb from "../../config/db.js"
import { successResponse } from "../../utils/apiResponse.js"

export const addUserWatchlistController = async (req, res, next) => {
    try {
        // Get user id from session
        const { userId } = req.session
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized. Please login."
            });
        }

        // Get product id from body
        const { productId } = req.body
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        // Check if product already exists in watchlist
        const [existing] = await connectToDb.promise().query(
            "SELECT id FROM watchlist WHERE user_id = ? AND product_id = ?",
            [userId, productId]
        )

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Product already in wishlist"
            });
        }

        // add watchlist item
        const [result] = await connectToDb.promise().query("INSERT INTO watchlist (user_id, product_id) VALUES(?, ?)", [userId, productId])
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "not found wishlist item"
            })
        }
        return successResponse(res, 201, "add wishlist successfully", result)
    } catch (err) {
        next(err)
    }
}

export const getSingleUserWatchlistController = async (req, res, next) => {
    try {
        // Get user id from session
        const { userId } = req.session
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized. Please login."
            });
        }

        const sql = `SELECT w.id AS watchlistId, p.id AS productId, p.product_category, p.product_type, p.selling_price, p.product_condition, p.front_photo
                    FROM watchlist w
                    JOIN products p ON w.product_id = p.id
                    WHERE w.user_id = ?`

        // fetch all watchlist items
        const [rows] = await connectToDb.promise().query(sql, [userId])
        return successResponse(res, 200, "fetch wishlist item successfully", rows[0])
    } catch (err) {
        next(err)
    }
}

export const getAllUserWatchlistController = async (req, res, next) => {
    try {
        // Get user id from session
        const { userId } = req.session
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized. Please login."
            });
        }

        const sql = `SELECT w.id AS watchlistId, p.id AS productId, p.product_category, p.product_type, p.selling_price, p.product_condition, p.front_photo
                    FROM watchlist w
                    JOIN products p ON w.product_id = p.id
                    WHERE w.user_id = ?`

        // fetch all watchlist items
        const [rows] = await connectToDb.promise().query(sql, [userId])
        return successResponse(res, 200, "fetch all wishlist items successfully", rows)
    } catch (err) {
        next(err)
    }
}

export const removeUserWatchlistController = async (req, res, next) => {
    try {
        // fetch watchlistId from url
        const { watchlistId } = req.params

        // watchlistId required
        if (!watchlistId) {
            return res.status(400).json({
                success: false,
                message: "wishlistId is required"
            })
        }

        // remove watchlist item
        const [result] = await connectToDb.promise().query("DELETE FROM watchlist WHERE id = ?", [watchlistId])
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'not remove wishlist product'
            })
        }
        return successResponse(res, 200, "remove wishlist successfully", result)
    } catch (err) {
        next(err)
    }
}