import express from "express";
// import { userAuth } from "../middleware/auth.js";
import { createUserTicket, getUserTickets, getUserSingleTicket } from "../../controllers/user/userSupportController.js";
import { isUserLoginIn } from "../../middlewares/authmiddlewares.js"

// define router object
const router = express.Router();

// define all routes
router.post("/create", isUserLoginIn, createUserTicket);
router.get("/my-tickets", userAuth, getUserTickets);
router.get("/:id", isUserLoginIn, getUserSingleTicket);

export default router;