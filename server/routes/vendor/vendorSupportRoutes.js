import express from "express";
import { createVendorTicketController, getAllVendorTicketController, getSingleTicketController } from "../../controllers/vendor/vendorSupportController.js"
import { isVendorLoginIn } from "../../middlewares/authmiddlewares.js"

// define router object
const router = express.Router();

// define all routes
router.post("/tickets", isVendorLoginIn, createVendorTicketController);
router.get("/tickets", isVendorLoginIn, getAllVendorTicketController);
router.get("/tickets/:id", isVendorLoginIn, getSingleTicketController);

export default router;