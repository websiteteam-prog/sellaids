import connectToDb from "../../config/db.js"
import { sendEmail } from "../../utils/mailer.js"

// create Vendor Ticket
export const createVendorTicketController = async (req, res) => {
    try {
        const { vendorId } = req.session
        if (!vendorId) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please log in." })
        }

        // fetch data from frontend
        const { subject, description } = req.body

        // check all field required or not
        if (!subject || !description) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        // Get vendor name & email from DB
        const [vendorRows] = await connectToDb.promise().query(
            "SELECT name, email FROM vendors WHERE id = ?",
            [vendorId]
        )

        if (vendorRows.length === 0) {
            return res.status(404).json({ success: false, message: "Vendor not found" })
        }

        const { name, email } = vendorRows[0]

        // create a ticket
        const [result] = await connectToDb.promise().query(
            "INSERT INTO vendor_tickets (vendor_id, subject, description) VALUES (?, ?, ?)",
            [vendorId, subject, description]
        )

        const text = `Hello ${name},\n\nWe have received your ticket:\n\n${description}\n\nThank you!`

        // send mail successfully
        await sendEmail(email, `Ticket Received: ${subject}`, text)

        return res.status(200).json({
            success: true,
            message: "ticket create successfully",
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ticket creation failed",
            error: error.message
        })
    }
}

export const getAllVendorTicketController = async (req, res) => {
    try {
        const { vendorId } = req.session
        if (!vendorId) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please log in." })
        }

        // fetch all ticket
        const result = await connectToDb.promise().query(
            "SELECT * FROM vendor_tickets WHERE vendor_id  = ? ORDER BY created_at DESC",
            [vendorId]
        );
        return res.status(200).json({
            success: true,
            message: "get all ticket successfully",
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "get all ticket failed",
            error: error.message
        })
    }
}

export const getSingleTicketController = async (req, res) => {
    try {
        const { vendorId } = req.session
        if (!vendorId) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please log in." })
        }

        // fetch ticket id from req.params
        const { id } = req.params

        // is required to ticket_id for 
        if (!id) {
            return res.status(400).json({ success: false, message: "ticket id is required" });
        }

        // fetch single ticket
        const [rows] = await connectToDb.promise().query(
            "SELECT * FROM vendor_tickets WHERE id  = ? AND vendor_id = ? ORDER BY created_at DESC",
            [id, vendorId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        return res.status(200).json({
            success: true,
            message: "get single ticket successfully",
            data: rows[0]
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "get single ticket failed",
            error: error.message
        })
    }
}