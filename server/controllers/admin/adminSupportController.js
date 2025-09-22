import { connectToDb } from "../db.js";
import { sendEmail } from "../utils/sendEmail.js";

// Get all tickets raised by user/vendor
export const getAllTickets = async (req, res) => {
  try {
    const [tickets] = await connectToDb.query(
      "SELECT t.*, u.name AS user_name FROM tickets t LEFT JOIN users u ON (t.panel_type='user' AND t.panel_id=u.id) LEFT JOIN vendors v ON (t.panel_type='vendor' AND t.panel_id=v.id) ORDER BY created_at DESC"
    );
    res.status(200).json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Close ticket
export const closeTicket = async (req, res) => {
  const ticketId = req.params.id;

  try {
    const [result] = await connectToDb.query(
      "UPDATE tickets SET status='closed', updated_at=NOW() WHERE id=?",
      [ticketId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Ticket not found" });

    // Fetch panel email
    const [rows] = await connectToDb.query(
      "SELECT panel_type, panel_id FROM tickets WHERE id=?",
      [ticketId]
    );
    if (rows.length) {
      const ticket = rows[0];
      let emailRow;
      if (ticket.panel_type === "user") {
        [emailRow] = await connectToDb.query("SELECT email FROM users WHERE id=?", [ticket.panel_id]);
      } else {
        [emailRow] = await connectToDb.query("SELECT email FROM vendors WHERE id=?", [ticket.panel_id]);
      }
      if (emailRow && emailRow.length) {
        await sendEmail(emailRow[0].email, "Your ticket is closed", "Hello, your ticket has been resolved.");
      }
    }

    res.status(200).json({ message: "Ticket closed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
