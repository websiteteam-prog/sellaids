import express from "express";
import db from "../config/db.js"; // MySQL connection
const router = express.Router();

// ========================
// GET all orders for a specific user
// ========================
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [orders] = await db.query(
      `SELECT 
         id,
         product_name,
         price,
         quantity,
         status,
         created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// ========================
// POST a new order (optional)
// ========================
router.post("/", async (req, res) => {
  const { user_id, product_name, price, quantity, status } = req.body;

  if (!user_id || !product_name || !price || !quantity) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO orders (user_id, product_name, price, quantity, status, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [user_id, product_name, price, quantity, status || "Pending"]
    );

    // Return the inserted order
    const [newOrder] = await db.query(
      `SELECT * FROM orders WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json(newOrder[0]);
  } catch (err) {
    console.error("Error adding order:", err);
    res.status(500).json({ message: "Error adding order" });
  }
});

export default router;
