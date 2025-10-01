import express from "express";
import { getAllUserTicketController, updateUserTicketStatusController, getAllVendorTicketController, updateVendorTicketStatusController } from "../../controllers/admin/adminSupportController.js";
import { isAdminLoginIn } from "../../middlewares/authmiddlewares.js"

// define router object
const router = express.Router();

// define all routes
// user admin side
router.get("/user/tickets", isAdminLoginIn, getAllUserTicketController);
router.put("/user/tickets/:id", isAdminLoginIn, updateUserTicketStatusController);

// vendor admin side
router.get("/vendor/tickets", isAdminLoginIn, getAllVendorTicketController);
router.put("/vendor/tickets/:id", isAdminLoginIn, updateVendorTicketStatusController);

export default router;
