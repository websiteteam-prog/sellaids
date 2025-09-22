import express from "express";
import { adminAuth } from "../middleware/auth.js";
import {
  getAllTickets,
  closeTicket
} from "../controllers/adminTicketController.js";

const router = express.Router();

// Get all tickets raised by all users/vendors
router.get("/tickets", adminAuth, getAllTickets);

// Close a ticket by ID (Admin)
router.patch("/tickets/:id/close", adminAuth, closeTicket);

export default router;
