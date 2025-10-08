import express from "express";
import { createOrderController, verifyPaymentSignatureController } from "../../controllers/user/userOrderController.js";

// define router object
const router = express.Router();

// define all routes
router.post("/create", createOrderController);
router.post("/verify", verifyPaymentSignatureController);

export default router;