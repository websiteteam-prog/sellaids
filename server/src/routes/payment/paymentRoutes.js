import express from "express";
import { createOrderController, verifyPaymentController, getLatestOrder } from "../payment/paymentController.js";
import { isUserLoginIn } from "../../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/create-order", isUserLoginIn, createOrderController);
router.post("/verify", isUserLoginIn, verifyPaymentController);
router.get("/user/:userId/latest-order", isUserLoginIn, getLatestOrder);

export default router;