import connectToDb from "../../config/db.js";
import { successResponse } from "../../utils/apiResponse.js";

export const getAdminProfileController = async (req, res, next) => {
    try {
        const { adminId } = req.session
        if (!adminId) {
            return res.status(400).json({ success: false, message: "plz login required" })
        }

        // fetch admin details from the 'admin' table
        const [rows] = await connectToDb.promise().query("SELECT name, email, phone FROM admin WHERE id = ?", [adminId])

        // If admin not found, return 404
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }
        return successResponse(res, 200, "get admin profile successfully", rows[0])
    } catch (err) {
        next(err)
    }
}

export const updateAdminProfileController = async (req, res, next) => {
    try {
        const { adminId } = req.session
        if (!adminId) {
            return res.status(400).json({ success: false, message: "plz login required" })
        }

        // extract data from frontend
        const { name, email, phone } = req.body

        // Get existing admin data first
        const [rows] = await connectToDb.promise().query(
            "SELECT name, email, phone FROM admin WHERE id = ?",
            [adminId]
        )

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Admin not found" })
        }
        const existingAdmin = rows[0]

        // Use provided values or fall back to existing ones
        const updatedName = name ?? existingAdmin.name
        const updatedEmail = email ?? existingAdmin.email
        const updatedPhone = phone ?? existingAdmin.phone
        // Update admin details in the database
        const result = await connectToDb.promise().query("UPDATE admin SET name = ?, email = ?, phone = ? WHERE id = ?", [updatedName, updatedEmail, updatedPhone, adminId])

        return successResponse(res, 200, "Profile updated successfully", result)
    } catch (err) {
        next(err)
    }
};