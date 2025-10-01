import connectToDb from "../../config/db.js"
import { successResponse } from "../../utils/apiResponse.js"

export const createVendorProductController = async (req, res) => {
    try {
        // Extract vendor ID from session
        const { vendorId } = req.session

        // vendor id required
        if (!vendorId) {
            return res.status(400).json({
                success: false,
                message: "You are not authorized. Please login."
            })
        }

        // fetch data from frontend
        const {
            group, category, type, condition, fit, fitOther, size, sizeOther,categoryId,
            invoice, needsRepair, repairDetails, originalBox, dustBag, additionalItems,
            purchasePrice, sellingPrice, reasonToSell, purchaseYear, purchasePlace, productLink, additionalInfo,
            name, email, phone, address, apartment, city, state, zip, sellerInfo, agree
        } = req.body;

        // Check if category exists
        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Category Id not found"
            })
        }


        await connectToDb.promise().query(`INSERT INTO products (vendor_id, group, category, type, condition, fit, fit_other, size, size_other, category_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [vendorId, group, category, type, condition, fit, fitOther, size, sizeOther, categoryId])
        await connectToDb.promise().query(`INSERT INTO products (group, category, type, condition, fit, fit_other, size, size_other, category_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [vendorId, group, category, type, condition, fit, fitOther, size, sizeOther, categoryId])

        const documentFields = ['front','back','label','inside','button','wearing','other']
        documentFields.map((field)=>{
            if(req.files?.[field]){
                const file = req.files[field][0]
                return connectToDb.promise.query('INSERT INTO product_images () VALUES()')
            }
        })
        await connectToDb.promise().query(`INSERT INTO product_images (group, category, type, condition, fit, fit_other, size, size_other, category_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [vendorId, group, category, type, condition, fit, fitOther, size, sizeOther, categoryId])
        await connectToDb.promise().query(`INSERT INTO products (purchase_price, selling_price, reason_to_sell, purchase_year, purchase_place, product_link, additional_info) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [purchasePrice, sellingPrice, reasonToSell, purchaseYear, purchasePlace, productLink, additionalInfo])
        await connectToDb.promise().query(`INSERT INTO products (agreed_to_terms, seller_info) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [vendorId, group, category, type, condition, fit, fitOther, size, sizeOther, agreed_to_terms, seller_info])
        // add product
        const result = await connectToDb.promise().query("INSERT INTO products WHERE vendor_id = ? AND category_id", [vendorId, categoryId])
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'product not found'
            })
        }
        return successResponse(res, 201, "create product successfully", result)
    } catch (error) {
        next(error)
    }
}

export const getAllVendorProductController = async (req, res) => {
    try {
        // Extract vendor ID from session
        const { vendorId } = req.session
        
        // vendor id required
        if (!vendorId) {
            return res.status(400).json({
                success: false,
                message: "You are not authorized. Please login."
            })
        }

        // fetch all products
        const [rows] = await connectToDb.promise().query("SELECT * FROM products WHERE vendor_id = ?", [vendorId])
        return successResponse(res, 200, "fetch all product successfully", rows)
    } catch (error) {
        next(error)
    }
}

export const getSingleVendorProductController = async (req, res) => {
    try {
        // Extract vendor ID from session
        const { vendorId } = req.session
        
        // vendor id required
        if (!vendorId) {
            return res.status(400).json({
                success: false,
                message: "You are not authorized. Please login."
            })
        }

        // fetch productId from url
        const { productId } = req.params

        // product id required
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "product id is required"
            })
        }

        // fetch single products
        const [rows] = await connectToDb.promise().query("SELECT * FROM products WHERE vendor_id = ? AND id = ?", [vendorId, productId])
        return successResponse(res, 200, "fetch all product successfully", rows)
    } catch (error) {
        next(error)
    }
}

export const updateVendorProductController = async (req, res) => {
    try {
        // Extract vendor ID from session
        const { vendorId } = req.session

        // vendor id required
        if (!vendorId) {
            return res.status(400).json({
                success: false,
                message: "You are not authorized. Please login."
            })
        }

        // fetch productId from url
        const { productId } = req.params

        // product id required
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "product id is required"
            })
        }

        return successResponse(res, 200, "update product successfully", result)
    } catch (error) {
        next(error)
    }
}

export const deleteVendorProductController = async (req, res) => {
    try {
        // Extract vendor ID from session
        const { vendorId } = req.session

        // vendor id required
        if (!vendorId) {
            return res.status(400).json({
                success: false,
                message: "You are not authorized. Please login."
            })
        }

        // fetch productId from url
        const { productId } = req.params

        // product id required
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "product id is required"
            })
        }

        // delete product
        const result = await connectToDb.promise().query("DELETE FROM products WHERE id = ? AND vendor_id = ?", [productId, vendorId])
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found or you are not the owner."
            });
        }
        return successResponse(res, 200, "delete product successfully", result)
    } catch (error) {
        next(error)
    }
}