import connectToDb from "../../config/db.js";

export const getAdminProfileController = async (req, res) => {
    try {
        // get admin ID from request parameters
        const adminId = req.params.id;

        // fetch admin details from the 'admin' table
        const [admin] = await connectToDb.promise().query("SELECT * FROM admin WHERE id = ?", [adminId]);

        // If admin not found, return 404
        if (admin.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "get admin profile successfully",
            data: admin[0]
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "get admin profile failed",
            error: err.message
        });
    }
};

export const updateAdminProfileController = async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        // get admin ID from params and new data from body
        const adminId = req.params.id;
        if (!adminId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // Get existing admin data first
        const [existingRows] = await connectToDb.promise().query(
            "SELECT * FROM admin WHERE id = ?",
            [adminId]
        );

        if (existingRows.length === 0) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        const existingAdmin = existingRows[0];

        // Use provided values or fall back to existing ones
        const updatedName = name ?? existingAdmin.name;
        const updatedEmail = email ?? existingAdmin.email;
        const updatedPhone = phone ?? existingAdmin.phone;
        // Update admin details in the database
        const [result] = await connectToDb.promise().query("UPDATE admin SET name = ?, email = ?, phone = ? WHERE id = ?", [updatedName, updatedEmail, updatedPhone, adminId]);

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