import connectToDb from "../config/db.js";

export const getUserProfileController = async (req, res) => {
    try {
        // get user ID from request parameters
        const userId = req.params.id;

        // fetch user details from the 'users' table
        const [user] = await connectToDb.promise().query("SELECT name, email, phone FROM users WHERE id = ?", [userId]);

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
        });
    }
};

export const updateUserProfileController = async (req, res) => {
    try {
        // get user ID from params and new data from body
        const userId = req.params.id;
        const { name, email, phone } = req.body;

        // Update user details in the database
        const [result] = await connectToDb.promise().query("UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?", [name, email, phone, userId]);

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: result
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Profile updated failed",
            error: err.message
        });
    }
};