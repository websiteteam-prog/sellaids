import connectToDb from "../../config/db.js"
import { successResponse } from "../../utils/apiResponse.js"

export const createVendorProductController = async (req, res, next) => {
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
            group, category, type, condition, fit, fitOther, size, sizeOther, categoryId,
            invoice, needsRepair, repairDetails, originalBox, dustBag, additionalItems,
            purchasePrice, sellingPrice, reasonToSell, purchaseYear, purchasePlace, productLink, additionalInfo, sellerInfo, agree
        } = req.body;

        console.log(req.files)

        // Image paths
        const frontPhoto = req.files['frontPhoto']?.[0]?.path || null;
        const backPhoto = req.files['backPhoto']?.[0]?.path || null;
        const labelPhoto = req.files['labelPhoto']?.[0]?.path || null;
        const insidePhoto = req.files['insidePhoto']?.[0]?.path || null;
        const buttonPhoto = req.files['buttonPhoto']?.[0]?.path || null;
        const wearingPhoto = req.files['wearingPhoto']?.[0]?.path || null;
        const invoicePhoto = req.files['invoicePhoto']?.[0]?.path || null;
        const repairPhoto = req.files['repairPhoto']?.[0]?.path || null;

        // Check if category exists
        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Category Id not found"
            })
        }

        const sql = `INSERT INTO products (category_id, vendor_id, product_condition, fit, fit_other, size, size_other,invoice, invoice_photo, needs_repair, repair_details, repair_photo, original_box, dust_bag, additional_items,front_photo, back_photo, label_photo, inside_photo, button_photo, wearing_photo, more_images,purchase_price, selling_price, reason_to_sell, purchase_year, purchase_place, product_link, additional_info,agree) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

        const values = [group, category, type, condition, fit, fitOther, size, sizeOther,frontPhoto, backPhoto, labelPhoto, insidePhoto, buttonPhoto, wearingPhoto, invoicePhoto, repairPhoto, categoryId, invoice, needsRepair, repairDetails, originalBox, dustBag, additionalItems, purchasePrice, sellingPrice, reasonToSell, purchaseYear, purchasePlace, productLink, additionalInfo, sellerInfo, agree]
        // add product
        const result = await connectToDb.promise().query(sql, values)
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