import connectToDb from "../../config/db.js"
import { successResponse } from "../../utils/apiResponse.js"

export const getAllAdminWatchlistProductController = async (req, res, next) => {
    try {
        // admin logged in or not
        const { adminId } = req.session
        if (!adminId) return res.status(401).json({ success: false, message: "Unauthorized" });

        // get query from frontend
        const { start_date, end_start, sort_by, page, per_page } = req.query

        // get all watchlist item
        const [rows] = await connectToDb.promise().query("SELECT * FROM watchlist")
        return successResponse(res, 200, "fetch all wishlist successfully", rows)
    } catch (err) {
        next(err)
    }
}

export const removeAdminWatchlistController = async (req, res, next) => {
    try {
        // admin logged in or not
        const { adminId } = req.session
        if (!adminId) return res.status(401).json({ success: false, message: "Unauthorized" });

        // fetch watchlistId from url
        const { watchlistId } = req.params

        // watchlistId required
        if (!watchlistId) {
            return res.status(400).json({
                success: false,
                message: "wishlistId is required"
            })
        }

        // remove watchlist item by admin
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