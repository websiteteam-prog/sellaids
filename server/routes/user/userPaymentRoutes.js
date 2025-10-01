import express from "express";
import { createPaymentController, verifyPaymentController } from "../../controllers/user/userPaymentController.js";

// define router object
const router = express.Router();

// define all routes
router.post("/create", createPaymentController);
router.post("/verify", verifyPaymentController);

export default router;