import connectToDb from "../../config/db.js"
import { successResponse } from "../../utils/apiResponse.js";

export const getUserProfileController = async (req, res, next) => {
    try {
        const { userId } = req.session
        if (!userId) {
            return res.status(400).json({ success: false, message: "plz login required" })
        }

        // fetch user details from the 'users' table
        const [rows] = await connectToDb.promise().query("SELECT name, email, phone FROM users WHERE id = ?", [userId])

        // If user not found, return 404
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return successResponse(res, 200, "get user profile successfully", rows[0])
    } catch (error) {
        next(error)
    }
};

export const updateUserProfileController = async (req, res, next) => {
    try {
        const { userId } = req.session
        if (!userId) {
            return res.status(400).json({ success: false, message: "plz login required" })
        }

        // extract data from frontend
        const { name, email, phone } = req.body

        // Get existing user data first
        const [rows] = await connectToDb.promise().query(
            "SELECT name, email, phone FROM users WHERE id = ?",
            [userId]
        )

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        const existingUser = rows[0]

        // Use provided values or fall back to existing ones
        const updatedName = name ?? existingUser.name
        const updatedEmail = email ?? existingUser.email
        const updatedPhone = phone ?? existingUser.phone

        // Update user details in the database
        const [result] = await connectToDb.promise().query("UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?", [updatedName, updatedEmail, updatedPhone, userId])

        return successResponse(res, 200, "Profile updated successfully", result)
    } catch (error) {
        next(error)
    }
};