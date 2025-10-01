import connectToDb from "../../config/db"
import { successResponse } from "../../utils/apiResponse.js"

export const getAllAdminWatchlistProductController = async (req, res, next) => {
    try {
        // fetch vendorId from frontend
        // const { vendorId } = req.params

        // get query from frontend
        const { start_date, end_start, sort_by, page, per_page } = req.query

        // vendor id required
        // if (!vendorId) {
        //     return res.status(400).json({
        //         success: false,
        //         message: `vendor id is required`
        //     })
        // }

        const sql = `SELECT p.id, p.name, p.image, p.price, p.stock FROM products p INNER JOIN watchlists w ON w.product_id = p.id GROUP BY DISTINCT ORDER BY p.id ASC`

        // get all watchlist item
        const result = await connectToDb.promise().query(sql)
        return successResponse(res, 200, "fetch all watchlist successfully", result)
    } catch (err) {
        next(err)
    }
}