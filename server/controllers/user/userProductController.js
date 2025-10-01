import connectToDb from "../../config/db.js"
import { successResponse } from "../../utils/apiResponse.js"

export const getAllUserProductController = async (req, res, next) => {
    try {
        // fetch all products
        const [products] = await connectToDb.promise().query(`SELECT * FROM products`)
        if (products.length === 0) {
            return res.status().json({
                success: false,
                message: "products not found"
            })
        }
        return successResponse(res, 200, "fetch all products successfully", products)
    } catch (error) {
        next(error)
    }
}

export const getSingleUserProductController = async (req, res, next) => {
    try {
        // fetch product id from url
        const { productId } = req.params
        if (!productId) {
            return res.status().json({
                success: false,
                message: "product id is required"
            })
        }

        // fetch product
        const [product] = await connectToDb.promise.query(`SELECT * FROM products`, [productId])
        if (product.length === 0) {
            return res.status().json({
                success: false,
                message: "product not found"
            })
        }
        return successResponse(res, 200, "fetch product successfully", product)
    } catch (error) {
        next(error)
    }
}