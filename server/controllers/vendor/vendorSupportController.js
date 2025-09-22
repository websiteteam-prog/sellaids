import { connectToDb } from "../db.js";

// Create ticket (Vendor)
export const createVendorTicket = async (req, res) => {
  const { title, description } = req.body;
  const vendorId = req.vendor.id;

  try {
    const [result] = await connectToDb.query(
      "INSERT INTO tickets (panel_type, panel_id, title, description, status) VALUES (?, ?, ?, ?, ?)",
      ["vendor", vendorId, title, description, "open"]
    );
    res.status(201).json({ message: "Ticket created", ticketId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get all tickets for vendor
export const getVendorTickets = async (req, res) => {
  const vendorId = req.vendor.id;

  try {
    const [tickets] = await connectToDb.query(
      "SELECT * FROM tickets WHERE panel_type=? AND panel_id=? ORDER BY created_at DESC",
      ["vendor", vendorId]
    );
    res.status(200).json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get single ticket
export const getVendorSingleTicket = async (req, res) => {
  const ticketId = req.params.id;
  const vendorId = req.vendor.id;

  try {
    const [tickets] = await connectToDb.query(
      "SELECT * FROM tickets WHERE id=? AND panel_type=? AND panel_id=?",
      [ticketId, "vendor", vendorId]
    );
    if (!tickets.length) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json(tickets[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
