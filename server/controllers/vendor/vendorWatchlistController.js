import connectToDb from "../../config/db"
import { successResponse } from "../../utils/apiResponse.js"

export const getAllVendorWatchlistProductController = async (req, res, next) => {
    try {
        // fetch vendorId from url
        const { vendorId } = req.params


        // vendor id required
        if (!vendorId) {
            return res.status(400).json({
                success: false,
                message: `vendor id is required`
            })
        }

        const sql = `SELECT p.id, p.name, p.image, p.price, p.stock, COUNT(DISTINCT w.user_id) AS watchlist_count FROM products p INNER JOIN watchlists w ON w.product_id = p.id WHERE p.vendor_id = ? GROUP BY p.id, p.name, p.image, p.price, p.stock ORDER BY watchlist_count DESC, p.id ASC`

        // get all watchlist item
        const result = await connectToDb.promise().query(sql, [vendorId])
        return successResponse(res, 200, "fetch all watchlist successfully", result)
    } catch (err) {
        next(err)
    }
}