import connectToDb from "../../config/db.js"
import { successResponse } from "../../utils/apiResponse.js"

export const getAllAdminProductController = async (req, res, next) => {
    try {
        const { search, status, category, order, page = 1, limit = 10 } = req.query

        const offset = (page - 1) * limit

        let conditions = [];
        let params = [];
      
        if (status) {
          conditions.push('status = ?');
          params.push(status);
        }
      
        if (category) {
          conditions.push('category = ?');
          params.push(category);
        }
      
        if (search) {
          conditions.push('name LIKE ?');
          params.push(`%${search}%`);
        }
      
        const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
      
        const query = `
          SELECT * FROM products
          ${whereClause}
          ORDER BY ${sortBy} ${order}
          LIMIT ?
          OFFSET ?
        `;


        // const [rows] = await db.execute(query, [...params, +limit, +offset]);
        // fetch all products
        const [products] = await connectToDb.promise().query(`SELECT * FROM products`)
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "products not found"
            })
        }
        return successResponse(res, 200, "fetch all products successfully", products)
    } catch (error) {
        next(error)
    }
}

export const getSingleAdminProductController = async (req, res, next) => {
    try {
        // fetch product id from url
        const { productId } = req.params
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "product id is required"
            })
        }

        // fetch product
        const [product] = await connectToDb.promise.query(`SELECT * FROM products`, [productId])
        if (product.length === 0) {
            return res.status(404).json({
                success: false,
                message: "product not found"
            })
        }
        return successResponse(res, 200, "fetch product successfully", product)
    } catch (error) {
        next(error)
    }
}

export const updateAdminProductController = async (req, res, next) => {
    try {
        // fetch product id from url
        const { productId } = req.params
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "product id is required"
            })
        }

        // fetch product
        const [getProduct] = await connectToDb.promise.query(`SELECT * FROM products`, [productId])
        if (getProduct.length === 0) {
            return res.status().json({
                success: false,
                message: "product not found"
            })
        }

        // await 
        return successResponse(res, 200, "Product updated successfully", getProduct)
    } catch (error) {
        next(error)
    }
}

export const deleteAdminProductController = async (req, res, next) => {
    try {
        // fetch product id from url
        const { productId } = req.params
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "product id is required"
            })
        }

        // delete product
        const [deleteProduct] = await connectToDb.promise.query(`DELETE FROM products WHERE id = ?`, [productId])
        if (deleteProduct.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "product not found"
            })
        }
        // fetch product
        const [product] = await connectToDb.promise.query(`SELECT * FROM products`, [productId])
        return successResponse(res, 200, "Product deleted successfully", product)
    } catch (error) {
        next(error)
    }
}

export const statusUpdateAdminProductController = async (req, res, next) => {
    try {
        // fetch product id from url
        const { productId } = req.params
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "product id is required"
            })
        }

        // fetch status from frontend
        const { status } = req.body
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "status is required"
            })
        }

        // status updated
        const [statusUpdate] = await connectToDb.promise.query(`UPDATE products SET status = ? WHERE id = ?`, [status, productId])
        if (statusUpdate.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "product not found"
            })
        }
        // fetch product
        const [product] = await connectToDb.promise.query(`SELECT * FROM products`, [productId])
        return successResponse(res, 200, "Product status updated successfully", product)
    } catch (error) {
        next(error)
    }
}