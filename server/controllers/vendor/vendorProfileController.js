import connectToDb from "../../config/db.js";

export const getVendorProfileController = async (req, res) => {
    try {
        // get vendor ID from request parameters
        const vendorId = req.params.id;

        // fetch vendor details from the 'vendors' table
        const [vendor] = await connectToDb.promise().query("SELECT name, email, phone FROM vendors WHERE id = ?", [vendorId]);

        // If vendor not found, return 404
        if (vendor.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "get vendor profile successfully",
            data: vendor[0]
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "get vendor profile failed",
            error: err.message
        });
    }
};

export const updateVendorProfileController = async (req, res) => {
    try {
        // get vendor ID from params and new data from body
        const vendorId = req.params.id;
        const { name, email, phone } = req.body;

        // Update vendor details in the database
        const [result] = await connectToDb.promise().query("UPDATE vendors SET name = ?, email = ?, phone = ? WHERE id = ?", [name, email, phone, vendorId]);

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