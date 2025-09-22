import express from "express";
import { vendorAuth } from "../middleware/auth.js";
import {
  createVendorTicket,
  getVendorTickets,
  getVendorSingleTicket
} from "../controllers/vendorTicketController.js";

const router = express.Router();

// Create ticket (Vendor)
router.post("/create", vendorAuth, createVendorTicket);

// Get all tickets raised by logged-in vendor
router.get("/my-tickets", vendorAuth, getVendorTickets);

// Get single ticket by ID (Vendor)
router.get("/:id", vendorAuth, getVendorSingleTicket);

export default router;
