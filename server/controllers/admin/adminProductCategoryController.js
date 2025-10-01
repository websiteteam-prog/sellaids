import connectToDb from "../../config/db.js"
import { successResponse } from "../../utils/apiResponse.js"
import { buildCategoryTree } from "../../utils/NestedCategory.js"

export const createProductCategoryController = async (req, res, next) => {
    try {
        // fetch data from frontend
        const { name, parentId = null } = req.body

        // Check if name is provided and valid
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Category name is required.' })
        }

        // Check for duplicate name under same parent
        const [existing] = await connectToDb.promise().query(
            'SELECT id FROM categories WHERE name = ? AND (parent_id = ? OR (parent_id IS NULL AND ? IS NULL))',
            [name, parentId, parentId]
        );

        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: 'Category with the same name already exists under this parent.' });
        }

        // If parent_id is provided, check if it exists
        if (parentId !== null) {
            const [parent] = await connectToDb.promise().query('SELECT id FROM categories WHERE id = ?', [parentId]);
            if (parent.length === 0) {
                return res.status(404).json({ success: false, message: 'Parent category not found.' });
            }
        }

        // create category
        const [result] = await connectToDb.promise().query(`INSERT INTO categories (name, parent_id) VALUES (?, ?)`, [name, parentId])
        return successResponse(res, 201, "category create successfully", result)
    } catch (error) {
        next(error)
    }
}

export const getAllProductCategoryController = async (req, res, next) => {
    try {
        // get All categories
        const [rows] = await connectToDb.promise().query(`SELECT * FROM categories ORDER BY id ASC`)
        const categoryTree = buildCategoryTree(rows)
        return successResponse(res, "get all category successfully", categoryTree)
    } catch (error) {
        next(error)
    }
}