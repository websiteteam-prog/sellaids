import connectToDb from "../../config/db.js"

export const createProductController = async (req, res) => {
    try {
        const data = req.body;

        // Basic required validations
        if (!data.name || !data.price || data.stock == null) {
            return res.status(400).json({ message: "Name, price and stock are required" });
        }

        const status = stock > 0 ? "Active" : "Out of Stock";

        const sql = ``
        const values = []

        const [result] = await connectToDb.promise().query(sql, values)

        return res.status(201).json({
            success: true,
            message: "Product create successfully",
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Product creation failed",
            error: error.message
        })
    }
}

export const getSingleProductController = async (req, res) => {
    try {
        // fetch the id from param
        const { id } = req.params;

        // fetch single product
        const [rows] = await connectToDb.promise().query("SELECT * FROM products WHERE id = ?", [id])
        return res.status(200).json({
            success: true,
            message: "get product successfully",
            data: rows[0]
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "get product failed",
            error: error.message
        })
    }
}

export const getAllProductController = async (req, res) => {
    try {
        // fetch all products
        const [rows] = await connectToDb.promise().query("SELECT * FROM products");
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "not found products"
            })
        }
        return res.status(200).json({
            success: true,
            message: "get all products successfully",
            data: rows
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "get all products failed",
            error: error.message
        })
    }
}

export const updateProductController = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Product update successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Product update failed",
            error: error.message
        })
    }
}

export const deleteProductController = async (req, res) => {
    try {
        // fetch the id from param
        const { id } = req.params;

        // delete product
        const [result] = await connectToDb.promise().query("DELETE FROM products WHERE id = ?", [id])
        return res.status(200).json({
            success: true,
            message: "Product delete successfully",
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Product delete failed",
            error: error.message
        })
    }
}