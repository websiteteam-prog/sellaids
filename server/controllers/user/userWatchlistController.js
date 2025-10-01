import connectToDb from "../../config/db.js"
import { successResponse } from "../../utils/apiResponse.js"

export const addUserWatchlistController = async (req, res, next) => {
    try {
        // fetch userId and itemId from url
        const { userId, itemId } = req.params

        // user and item id required
        if (!userId || !itemId) {
            return res.status(400).json({
                success: false,
                message: `${!userId ? "user" : "item"} id is required`
            })
        }

        // add watchlist item
        const [addWatchlistItem] = await connectToDb.promise().query("INSERT INTO watchlist (user_id, item_id) VALUES(?, ?)", [userId, itemId])
        if (addWatchlistItem.length ===1) {
            return res.status(404).json({
                success: false,
                message: "not found watchlist item"
            })
        }
        return successResponse(res, 201, "add watchlist successfully", addWatchlistItem)
    } catch (err) {
        next(err)
    }
}

export const getAllUserWatchlistController = async (req, res, next) => {
    try {
        // fetch userId and itemId from url
        const { userId, itemId } = req.params

        // user and item id required
        if (!userId || !itemId) {
            return res.status(400).json({
                success: false,
                message: `${!userId ? "user" : "item"} id is required`
            })
        }

        // fetch all watchlist items
        const [getWatchlistItems] = await connectToDb.promise().query("SELECT * FROM watchlist WHERE user_id = ? AND id = ?", [userId, itemId])
        return successResponse(res, 200, "fetch all watchlist items successfully", getWatchlistItems)
    } catch (err) {
        next(err)
    }
}

export const removeUserWatchlistController = async (req, res, next) => {
    try {
        // fetch itemId from url
        const { itemId } = req.params

        // itemId id required
        if (!itemId) {
            return res.status(400).json({
                success: false,
                message: "item id is required"
            })
        }

        // remove watchlist item
        const [removeWatchlistItem] = await connectToDb.promise().query("DELETE FROM watchlist WHERE id = ?", [itemId])
        if (removeWatchlistItem.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            })
        }
        return successResponse(res, 200, "remove watchlist successfully", removeWatchlistItem)
    } catch (err) {
        next(err)
    }
}