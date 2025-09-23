import { connectToDb } from "../../config/db.js"

export const createUserTicket = async (req, res) => {
    try {
        // fetch data from frontend
        const { name, email, subject, description } = req.body;

        // check all field required or not
        if (!name || !email || !subject || !description) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // create a ticket
        const [result] = await connectToDb.promise().query(
            "INSERT INTO tickets (name, email, subject, description, status) VALUES (?, ?, ?, ?, ?)",
            [name, email, subject, description]
        );
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

export const getUserSingleTicket = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const userId = req.user.id;
        // get Single ticket
        const [tickets] = await connectToDb.promise().query(
            "SELECT * FROM tickets WHERE id=? AND panel_type=? AND panel_id=?",
            [ticketId, "user", userId]
        );
        if (tickets.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Ticket not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "get single ticket successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "get single ticket failed",
            error: error.message
        })
    }
}

export const getUserTickets = async (req, res) => {
    try {
        const userId = req.user.id;
        // get all rase ticket
        const [tickets] = await connectToDb.promise().query(
            "SELECT * FROM tickets WHERE panel_type=? AND panel_id=? ORDER BY created_at DESC",
            ["user", userId]
        )
        if (tickets.length === 0) {
            res.status(400).json({
                success: false,
                message: "not get all ticket"
            });
        }
        return res.status(200).json({
            success: true,
            message: "get all ticket successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "get all ticket failed",
            error: error.message
        })
    }
}