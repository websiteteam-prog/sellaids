import connectToDb from "../../config/db.js";

// Admin: get all users ticket
export const getAllUserTicketController = async (req, res) => {
    try {
        // fetch all user ticket admin side
        const [rows] = await connectToDb.promise().query(
            "SELECT * FROM user_tickets ORDER BY created_at DESC"
        );
        return res.status(200).json({
            success: true,
            message: "Fetch all tickets successfully",
            tickets: rows
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Fetch all tickets failed",
            error: error.message
        });
    }
};

// Admin: Update User Ticket Status
export const updateUserTicketStatusController = async (req, res) => {
    try {
        // ticket id from url
        const { id } = req.params;

        // fetch status from frontend
        const { status } = req.body;

        // update the ticket status
        const [result] = await connectToDb.promise().query(
            "UPDATE user_tickets SET status = ? WHERE id = ?",
            [status, id]
        );

        // If no rows were affected, ticket was not found
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        // Successfully updated
        return res.status(200).json({
            success: true,
            message: "Ticket status updated successfully",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update ticket status",
            error: error.message
        });
    }
};

// Admin: get all vendor ticket
export const getAllVendorTicketController = async (req, res) => {
    try {
        // fetch all vendor ticket admin side
        const [rows] = await connectToDb.promise().query(
            "SELECT * FROM vendor_tickets ORDER BY created_at DESC"
        );
        return res.status(200).json({
            success: true,
            message: "Fetch all tickets successfully",
            tickets: rows
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Fetch all tickets failed",
            error: error.message
        });
    }
};

// Admin: Update Vendor Ticket Status
export const updateVendorTicketStatusController = async (req, res) => {
    try {
        // ticket id from url
        const { id } = req.params;

        // fetch status from frontend
        const { status } = req.body;

        // Check if the new status is valid
        if (!["open", "in-progress", "resolved", "closed"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        // update the ticket status
        const [result] = await connectToDb.promise().query(
            "UPDATE vendor_tickets SET status = ? WHERE id = ?",
            [status, id]
        );

        // If no rows were affected, ticket was not found
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        // Successfully updated
        return res.status(200).json({
            success: true,
            message: "Ticket status updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update ticket status",
            error: error.message
        });
    }
};