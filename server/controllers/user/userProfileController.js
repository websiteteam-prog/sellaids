import connectToDb from "../../config/db.js"

export const getUserProfileController = async (req, res) => {
    try {
        // get user ID from request parameters
        const userId = req.params.id
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" })
        }

        // fetch user details from the 'users' table
        const [user] = await connectToDb.promise().query("SELECT name, email, phone FROM users WHERE id = ?", [userId])

        // If user not found, return 404
        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "get user profile successfully",
            data: user[0]
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "get user profile failed",
            error: err.message
        })
    }
};

export const updateUserProfileController = async (req, res) => {
    try {
        const { name, email, phone } = req.body

        // get user ID from params and new data from body
        const userId = req.params.id
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // Get existing user data first
        const [existingRows] = await connectToDb.promise().query(
            "SELECT name, email, phone FROM users WHERE id = ?",
            [userId]
        )

        if (existingRows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        const existingUser = existingRows[0]

        // Use provided values or fall back to existing ones
        const updatedName = name ?? existingUser.name
        const updatedEmail = email ?? existingUser.email
        const updatedPhone = phone ?? existingUser.phone

        // Update user details in the database
        const [result] = await connectToDb.promise().query("UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?", [updatedName, updatedEmail, updatedPhone, userId])

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: result
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Profile updated failed",
            error: err.message
        })
    }
};