import connectToDb from "../config/db.js"

export const createProductController = async (req, res) => {
    try {
        const { name, description, price, stock, category, image } = req.body;

        if (!name || !price || stock == null) {
            return res.status(400).json({ message: "Name, price and stock are required" });
        }

        const status = stock > 0 ? "Active" : "Out of Stock";

        const [result] = await connectToDb.query(
            "INSERT INTO products (name, description, price, stock, category, image, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [name, description, price, stock, category, image, status]
        );

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
        return res.status(200).json({
            success: true,
            message: "get product successfully"
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
        const [rows] = await db.query("SELECT * FROM products");
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
        return res.status(200).json({
            success: true,
            message: "Product delete successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Product delete failed",
            error: error.message
        })
    }
}