import express from "express";
import { createUserTicketController, getAllUserTicketController, getUserSingleTicket } from "../../controllers/user/userSupportController.js";
import { isUserLoginIn } from "../../middlewares/authmiddlewares.js"

// define router object
const router = express.Router();

// define all routes
router.post("/tickets", isUserLoginIn, createUserTicketController);
router.get("/tickets", isUserLoginIn, getAllUserTicketController);
router.get("/tickets/:id", isUserLoginIn, getUserSingleTicket);

export default router;