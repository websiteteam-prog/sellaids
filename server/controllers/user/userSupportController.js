import connectToDb from "../../config/db.js"
import { sendEmail } from "../../utils/mailer.js"

export const createUserTicketController = async (req, res) => {
    try {
        const { userId } = req.session
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please log in." })
        }

        // fetch data from frontend
        const { subject, description } = req.body

        // check all field required or not
        if (!subject || !description) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Get user name & email from DB
        const [rows] = await connectToDb.promise().query(
            "SELECT name, email FROM users WHERE id = ?",
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const { name, email } = rows[0];

        // create a ticket
        const [result] = await connectToDb.promise().query(
            "INSERT INTO user_tickets (user_id, subject, description) VALUES (?, ?, ?)",
            [userId, subject, description]
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

export const getAllUserTicketController = async (req, res) => {
    try {
        const { userId } = req.session
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
        }

        // fetch all ticket
        const [rows] = await connectToDb.promise().query(
            "SELECT * FROM user_tickets WHERE user_id  = ? ORDER BY created_at DESC",
            [userId]
        );
        return res.status(200).json({
            success: true,
            message: "get all ticket successfully",
            data: rows
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "get all ticket failed",
            error: error.message
        })
    }
}

export const getUserSingleTicket = async (req, res) => {
    try {
        const { userId } = req.session
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
        }

        // fetch ticket id from req.params
        const { id } = req.params

        // is required to ticket_id for 
        if (!id) {
            return res.status(400).json({ success: false, message: "ticket id is required" });
        }

        // fetch single ticket
        const [rows] = await connectToDb.promise().query(
            "SELECT * FROM user_tickets WHERE id  = ? and user_id = ? ORDER BY created_at DESC",
            [id, userId]
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