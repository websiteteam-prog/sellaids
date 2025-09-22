import { connectToDb } from "../db.js";

// Create ticket (User)
export const createUserTicket = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  try {
    const [result] = await connectToDb.query(
      "INSERT INTO tickets (panel_type, panel_id, title, description, status) VALUES (?, ?, ?, ?, ?)",
      ["user", userId, title, description, "open"]
    );
    res.status(201).json({ message: "Ticket created", ticketId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get all tickets for user
export const getUserTickets = async (req, res) => {
  const userId = req.user.id;

  try {
    const [tickets] = await connectToDb.query(
      "SELECT * FROM tickets WHERE panel_type=? AND panel_id=? ORDER BY created_at DESC",
      ["user", userId]
    );
    res.status(200).json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get single ticket
export const getUserSingleTicket = async (req, res) => {
  const ticketId = req.params.id;
  const userId = req.user.id;

  try {
    const [tickets] = await connectToDb.query(
      "SELECT * FROM tickets WHERE id=? AND panel_type=? AND panel_id=?",
      [ticketId, "user", userId]
    );
    if (!tickets.length) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json(tickets[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
