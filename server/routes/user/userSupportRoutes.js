import express from "express";
import { userAuth } from "../middleware/auth.js";
import { createUserTicket, getUserTickets, getUserSingleTicket } from "../controllers/userTicketController.js";

const router = express.Router();

router.post("/create", userAuth, createUserTicket);
router.get("/my-tickets", userAuth, getUserTickets);
router.get("/:id", userAuth, getUserSingleTicket);

export default router;